const mongoose = require("mongoose");

const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80";

// Field shapes are kept compatible with documents created by the original app:
//   contacts.friends  -> [{ id, name, photo }]
//   contacts.requests -> [{ id, name, photo, status: "received" | "requested" }]
//   chats             -> [{ roomId, friendsProfile }]  (legacy chat rooms)
//   info              -> [{ type: "work" | "education" | "location" | "relation", ... }]
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  profilePic: {
    type: String,
    default: DEFAULT_PHOTO,
  },
  coverPic: {
    type: String,
    default: DEFAULT_PHOTO,
  },
  status: {
    type: String,
    default: "Hi there! I'm new to Mingle.",
  },
  birthdate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  contacts: {
    friends: [{}],
    requests: [{}],
  },
  chats: [{}],
  chatsMigrated: {
    type: Boolean,
    default: false,
  },
  info: [{ type: Object }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ProfileSchema.index({ user: 1 });

ProfileSchema.statics.DEFAULT_PHOTO = DEFAULT_PHOTO;

module.exports = mongoose.model("profile", ProfileSchema);
