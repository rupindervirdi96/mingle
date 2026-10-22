const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "conversation",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 4000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ChatMessageSchema.index({ conversation: 1, createdAt: -1 });

module.exports = mongoose.model("chatmessage", ChatMessageSchema);
