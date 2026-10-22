const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "profile", required: true },
    ],
    // Sorted "<idA>:<idB>" so a pair of profiles can only ever have one conversation.
    key: { type: String, required: true, unique: true },
    lastMessage: {
      text: String,
      sender: mongoose.Schema.Types.ObjectId,
      createdAt: Date,
    },
    // profileId -> time that participant last read the conversation
    lastRead: { type: Map, of: Date, default: {} },
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1, updatedAt: -1 });

ConversationSchema.statics.keyFor = (a, b) =>
  [a.toString(), b.toString()].sort().join(":");

module.exports = mongoose.model("conversation", ConversationSchema);
