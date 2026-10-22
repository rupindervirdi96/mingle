const Notification = require("../models/notification.model");
const Profile = require("../models/profile.model");
const { summary, SUMMARY_FIELDS } = require("./profiles");
const { emitTo } = require("./realtime");

const serialize = (n, actor) => ({
  _id: n._id.toString(),
  type: n.type,
  actor,
  post: n.post ? n.post.toString() : null,
  text: n.text || "",
  read: n.read,
  createdAt: n.createdAt,
});

// Stores a notification and pushes it to the recipient's open tabs.
const notify = async ({ recipient, actor, type, post, text }) => {
  if (String(recipient) === String(actor)) return null;
  try {
    const notification = await Notification.create({
      recipient,
      actor,
      type,
      post,
      text,
    });
    const actorProfile = await Profile.findById(actor).select(SUMMARY_FIELDS);
    const payload = serialize(notification, summary(actorProfile));
    emitTo(recipient, "notification:new", payload);
    return payload;
  } catch (error) {
    // A failed notification must never fail the action that triggered it.
    console.error("notify failed:", error.message);
    return null;
  }
};

// Removes notifications that no longer make sense (an unlike, a cancelled request).
const retract = async (filter) => {
  const removed = await Notification.find(filter).select("_id recipient");
  if (!removed.length) return;
  await Notification.deleteMany({ _id: { $in: removed.map((n) => n._id) } });
  removed.forEach((n) =>
    emitTo(n.recipient, "notification:removed", { _id: n._id.toString() })
  );
};

module.exports = { notify, retract, serialize };
