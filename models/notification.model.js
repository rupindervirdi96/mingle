const mongoose = require("mongoose");

const TYPES = ["friend_request", "friend_accept", "post_like", "post_comment"];

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
    required: true,
  },
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
    required: true,
  },
  type: {
    type: String,
    enum: TYPES,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  text: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

NotificationSchema.index({ recipient: 1, createdAt: -1 });

NotificationSchema.statics.TYPES = TYPES;

module.exports = mongoose.model("notification", NotificationSchema);
