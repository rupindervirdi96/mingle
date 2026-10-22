const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Notification = require("../models/notification.model");
const { getMyProfile, summariesById } = require("../lib/profiles");
const { serialize } = require("../lib/notify");
const { emitTo } = require("../lib/realtime");
const { notFound } = require("../lib/errors");

const router = express.Router();
router.use(auth);

const PAGE_SIZE = 20;

// route   GET /api/notifications?before=&unread=1
router.get("/", async (req, res) => {
  const me = await getMyProfile(req);
  const filter = { recipient: me._id };
  if (req.query.unread === "1") filter.read = false;
  const before = req.query.before ? new Date(req.query.before) : null;
  if (before && !Number.isNaN(before.getTime())) filter.createdAt = { $lt: before };

  const [items, unread] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).limit(PAGE_SIZE + 1),
    Notification.countDocuments({ recipient: me._id, read: false }),
  ]);
  const page = items.slice(0, PAGE_SIZE);
  const actors = await summariesById(page.map((n) => n.actor));
  res.json({
    items: page
      .map((n) => serialize(n, actors.get(String(n.actor))))
      .filter((n) => n.actor),
    unread,
    hasMore: items.length > PAGE_SIZE,
  });
});

// route   POST /api/notifications/read-all
router.post("/read-all", async (req, res) => {
  const me = await getMyProfile(req);
  await Notification.updateMany({ recipient: me._id, read: false }, { $set: { read: true } });
  emitTo(me._id, "notification:read", { all: true });
  res.json({ unread: 0 });
});

const findMine = async (req) => {
  const me = await getMyProfile(req);
  if (!mongoose.isValidObjectId(req.params.id)) throw notFound("Notification not found.");
  const notification = await Notification.findOne({ _id: req.params.id, recipient: me._id });
  if (!notification) throw notFound("Notification not found.");
  return { me, notification };
};

// route   POST /api/notifications/:id/read
router.post("/:id/read", async (req, res) => {
  const { me, notification } = await findMine(req);
  notification.read = true;
  await notification.save();
  emitTo(me._id, "notification:read", { _id: notification._id.toString() });
  res.json({ _id: notification._id.toString() });
});

// route   DELETE /api/notifications/:id
router.delete("/:id", async (req, res) => {
  const { me, notification } = await findMine(req);
  await notification.deleteOne();
  emitTo(me._id, "notification:removed", { _id: notification._id.toString() });
  res.json({ _id: notification._id.toString() });
});

module.exports = router;
