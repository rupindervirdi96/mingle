const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Profile = require("../models/profile.model");
const {
  getMyProfile,
  friendIds,
  requestsByStatus,
  relationship,
  summariesById,
  summary,
  SUMMARY_FIELDS,
} = require("../lib/profiles");
const { notify, retract } = require("../lib/notify");
const { emitTo, isOnline, setFriends } = require("../lib/realtime");
const { badRequest, notFound } = require("../lib/errors");

const router = express.Router();
router.use(auth);

const loadTarget = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw notFound("This person doesn't exist.");
  const profile = await Profile.findById(id);
  if (!profile) throw notFound("This person doesn't exist.");
  return profile;
};

const contactEntry = (profile, extra = {}) => ({
  id: profile._id.toString(),
  name: profile.name,
  photo: profile.profilePic,
  ...extra,
});

const pullRequests = (a, b) =>
  Promise.all([
    Profile.updateOne({ _id: a }, { $pull: { "contacts.requests": { id: String(b) } } }),
    Profile.updateOne({ _id: b }, { $pull: { "contacts.requests": { id: String(a) } } }),
  ]);

// Tell both people's open tabs to refresh their friend lists and presence.
const syncFriends = async (...profileIds) => {
  const profiles = await Profile.find({ _id: { $in: profileIds } }).select("contacts.friends");
  await Promise.all(profiles.map((p) => setFriends(p._id, friendIds(p))));
  profileIds.forEach((id) => emitTo(id, "friends:update", {}));
};

// route   GET /api/friends
// desc    Friends, received requests and sent requests with fresh names/photos
router.get("/", async (req, res) => {
  const me = await getMyProfile(req);
  const received = requestsByStatus(me, "received").map((r) => String(r.id));
  const sent = requestsByStatus(me, "requested").map((r) => String(r.id));
  const ids = friendIds(me);
  const profiles = await summariesById([...ids, ...received, ...sent]);
  const pick = (list) =>
    list
      .map((id) => profiles.get(id))
      .filter(Boolean)
      .map((p) => ({ ...p, online: isOnline(p._id) }));

  res.json({ friends: pick(ids), received: pick(received), sent: pick(sent) });
});

// route   GET /api/friends/suggestions
// desc    People you may know, ranked by mutual friends
router.get("/suggestions", async (req, res) => {
  const me = await getMyProfile(req);
  const myFriends = friendIds(me);
  const exclude = new Set([
    me._id.toString(),
    ...myFriends,
    ...(me.contacts?.requests || []).map((r) => String(r.id)),
  ]);

  const mutual = new Map();
  const friendProfiles = await Profile.find({ _id: { $in: myFriends } }).select("contacts.friends");
  friendProfiles.forEach((fp) =>
    friendIds(fp).forEach((id) => {
      if (!exclude.has(id)) mutual.set(id, (mutual.get(id) || 0) + 1);
    })
  );

  const candidates = await Profile.find({
    _id: { $nin: [...exclude].filter(mongoose.isValidObjectId) },
  })
    .select(SUMMARY_FIELDS + " createdAt")
    .sort({ createdAt: -1 })
    .limit(60);

  const ranked = candidates
    .map((p) => ({ ...summary(p), mutualCount: mutual.get(p._id.toString()) || 0 }))
    .sort((a, b) => b.mutualCount - a.mutualCount)
    .slice(0, 12);
  res.json(ranked);
});

// route   POST /api/friends/requests/:id
// desc    Send a friend request (or accept theirs if they already sent one)
router.post("/requests/:id", async (req, res) => {
  const [me, target] = await Promise.all([getMyProfile(req), loadTarget(req.params.id)]);
  const status = relationship(me, target._id);
  if (status === "self") throw badRequest("You can't add yourself.");
  if (status === "friends") throw badRequest("You're already friends.");
  if (status === "requested") return res.json({ relationship: "requested" });
  if (status === "received") return acceptRequest(me, target, res);

  await Promise.all([
    Profile.updateOne(
      { _id: target._id },
      { $push: { "contacts.requests": { $each: [contactEntry(me, { status: "received" })], $position: 0 } } }
    ),
    Profile.updateOne(
      { _id: me._id },
      { $push: { "contacts.requests": { $each: [contactEntry(target, { status: "requested" })], $position: 0 } } }
    ),
  ]);
  await notify({ recipient: target._id, actor: me._id, type: "friend_request" });
  emitTo(target._id, "friends:update", {});
  res.json({ relationship: "requested" });
});

const acceptRequest = async (me, target, res) => {
  await pullRequests(me._id, target._id);
  await Promise.all([
    Profile.updateOne(
      { _id: me._id, "contacts.friends.id": { $ne: target._id.toString() } },
      { $push: { "contacts.friends": { $each: [contactEntry(target)], $position: 0 } } }
    ),
    Profile.updateOne(
      { _id: target._id, "contacts.friends.id": { $ne: me._id.toString() } },
      { $push: { "contacts.friends": { $each: [contactEntry(me)], $position: 0 } } }
    ),
  ]);
  await retract({ type: "friend_request", actor: target._id, recipient: me._id });
  await notify({ recipient: target._id, actor: me._id, type: "friend_accept" });
  await syncFriends(me._id, target._id);
  emitTo(target._id, "presence", { profileId: me._id.toString(), online: isOnline(me._id) });
  emitTo(me._id, "presence", { profileId: target._id.toString(), online: isOnline(target._id) });
  res.json({ relationship: "friends" });
};

// route   POST /api/friends/requests/:id/accept
router.post("/requests/:id/accept", async (req, res) => {
  const [me, target] = await Promise.all([getMyProfile(req), loadTarget(req.params.id)]);
  if (relationship(me, target._id) !== "received") {
    throw badRequest("There's no friend request from this person.");
  }
  await acceptRequest(me, target, res);
});

// route   DELETE /api/friends/requests/:id
// desc    Decline a received request or cancel a sent one
router.delete("/requests/:id", async (req, res) => {
  const [me, target] = await Promise.all([getMyProfile(req), loadTarget(req.params.id)]);
  await pullRequests(me._id, target._id);
  await retract({
    type: "friend_request",
    $or: [
      { actor: me._id, recipient: target._id },
      { actor: target._id, recipient: me._id },
    ],
  });
  emitTo(target._id, "friends:update", {});
  res.json({ relationship: "none" });
});

// route   DELETE /api/friends/:id
// desc    Unfriend
router.delete("/:id", async (req, res) => {
  const [me, target] = await Promise.all([getMyProfile(req), loadTarget(req.params.id)]);
  await Promise.all([
    Profile.updateOne({ _id: me._id }, { $pull: { "contacts.friends": { id: target._id.toString() } } }),
    Profile.updateOne({ _id: target._id }, { $pull: { "contacts.friends": { id: me._id.toString() } } }),
  ]);
  await syncFriends(me._id, target._id);
  emitTo(target._id, "presence", { profileId: me._id.toString(), online: false });
  emitTo(me._id, "presence", { profileId: target._id.toString(), online: false });
  res.json({ relationship: "none" });
});

module.exports = router;
