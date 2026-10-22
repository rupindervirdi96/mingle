const mongoose = require("mongoose");

// Legacy chat storage from the original app. Read only: rooms are migrated into
// Conversation + ChatMessage the first time a user opens their chats.
const ChatRoomSchema = new mongoose.Schema({
  messages: [{}],
});

module.exports = mongoose.model("chatroom", ChatRoomSchema);
