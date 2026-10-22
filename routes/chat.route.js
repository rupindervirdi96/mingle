const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Profile = require("../models/profile.model");
const Conversation = require("../models/conversation.model");
const ChatMessage = require("../models/chatMessage.model");
const ChatRoom = require("../models/chatRoom.model");
const { getMyProfile, friendIds, summariesById } = require("../lib/profiles");
const { emitTo, isOnline } = require("../lib/realtime");
const { badRequest, forbidden, notFound } = require("../lib/errors");

const router = express.Router();
router.use(auth);

const PAGE_SIZE = 30;

const serializeMessage = (m) => ({
  _id: m._id.toString(),
  conversation: m.conversation.toString(),
  sender: m.sender.toString(),
  text: m.text,
  createdAt: m.createdAt,
});

const otherParticipant = (conversation, meId) =>
  conversation.participants.map(String).find((id) => id !== meId) || meId;

const unreadCount = (conversation, meId) =>
  ChatMessage.countDocuments({
    conversation: conversation._id,
    sender: { $ne: meId },
    createdAt: { $gt: conversation.lastRead.get(meId) || new Date(0) },
  });

const serializeConversation = async (conversation, meId, profiles) => {
  const friendId = otherParticipant(conversation, meId);
  const friend = profiles.get(friendId) || { _id: friendId, name: "Mingle user" };
  return {
    _id: conversation._id.toString(),
    friend: { ...friend, online: isOnline(friendId) },
    lastMessage: conversation.lastMessage?.createdAt
      ? {
          text: conversation.lastMessage.text,
          sender: String(conversation.lastMessage.sender),
          createdAt: conversation.lastMessage.createdAt,
        }
      : null,
    // When the other person last read the chat; drives "Seen" receipts.
    friendLastRead: conversation.lastRead.get(friendId) || null,
    unread: await unreadCount(conversation, meId),
    updatedAt: conversation.updatedAt,
  };
};

const loadConversation = async (id, meId) => {
  if (!mongoose.isValidObjectId(id)) throw notFound("Conversation not found.");
  const conversation = await Conversation.findById(id);
  if (!conversation) throw notFound("Conversation not found.");
  if (!conversation.participants.map(String).includes(meId)) {
    throw forbidden("You're not part of this conversation.");
  }
  return conversation;
};

// The original app kept messages inside `chatroom` documents linked from each
// profile's `chats` array. Copy those into conversations once per profile.
const migrateLegacyChats = async (me) => {
  if (me.chatsMigrated) return;
  for (const chat of me.chats || []) {
    const friendId = String(chat.friendsProfile || "");
    if (!mongoose.isValidObjectId(friendId) || !mongoose.isValidObjectId(chat.roomId)) continue;
    const key = Conversation.keyFor(me._id, friendId);
    if (await Conversation.exists({ key })) continue;

    const room = await ChatRoom.findById(chat.roomId).lean();
    const messages = (room?.messages || []).filter(
      (m) => m && m.text && mongoose.isValidObjectId(String(m.sender))
    );
    if (!messages.length) continue;

    const last = messages[messages.length - 1];
    const lastAt = new Date(last.time || Date.now());
    try {
      const conversation = await Conversation.create({
        participants: [me._id, friendId],
        key,
        lastMessage: { text: last.text, sender: last.sender, createdAt: lastAt },
        lastRead: { [me._id.toString()]: lastAt, [friendId]: lastAt },
      });
      await ChatMessage.insertMany(
        messages.map((m) => ({
          conversation: conversation._id,
          sender: m.sender,
          text: m.text,
          createdAt: m.time ? new Date(m.time) : conversation.createdAt,
        }))
      );
    } catch (error) {
      if (error.code !== 11000) throw error; // the friend's migration got there first
    }
  }
  await Profile.updateOne({ _id: me._id }, { $set: { chatsMigrated: true } });
};

// route   GET /api/chats
// desc    Your conversations, most recent first
router.get("/", async (req, res) => {
  const me = await getMyProfile(req);
  const meId = me._id.toString();
  await migrateLegacyChats(me);

  const conversations = await Conversation.find({
    participants: me._id,
    "lastMessage.createdAt": { $exists: true },
  })
    .sort({ updatedAt: -1 })
    .limit(50);
  const profiles = await summariesById(conversations.map((c) => otherParticipant(c, meId)));
  res.json(await Promise.all(conversations.map((c) => serializeConversation(c, meId, profiles))));
});

// route   POST /api/chats/with/:profileId
// desc    Open (or start) the conversation with a friend
router.post("/with/:profileId", async (req, res) => {
  const me = await getMyProfile(req);
  const meId = me._id.toString();
  const friendId = String(req.params.profileId);
  if (!mongoose.isValidObjectId(friendId) || friendId === meId) {
    throw badRequest("You can't message this person.");
  }
  await migrateLegacyChats(me);

  const key = Conversation.keyFor(meId, friendId);
  let conversation = await Conversation.findOne({ key });
  if (!conversation) {
    if (!friendIds(me).includes(friendId)) {
      throw forbidden("You can only message your friends.");
    }
    if (!(await Profile.exists({ _id: friendId }))) throw notFound("This person doesn't exist.");
    try {
      conversation = await Conversation.create({ participants: [meId, friendId], key });
    } catch (error) {
      if (error.code !== 11000) throw error;
      conversation = await Conversation.findOne({ key });
    }
  }
  const profiles = await summariesById([friendId]);
  res.json(await serializeConversation(conversation, meId, profiles));
});

// route   GET /api/chats/:id/messages?before=
// desc    A page of messages, oldest first
router.get("/:id/messages", async (req, res) => {
  const me = await getMyProfile(req);
  const conversation = await loadConversation(req.params.id, me._id.toString());
  const filter = { conversation: conversation._id };
  const before = req.query.before ? new Date(req.query.before) : null;
  if (before && !Number.isNaN(before.getTime())) filter.createdAt = { $lt: before };

  const messages = await ChatMessage.find(filter)
    .sort({ createdAt: -1 })
    .limit(PAGE_SIZE + 1);
  res.json({
    messages: messages.slice(0, PAGE_SIZE).reverse().map(serializeMessage),
    hasMore: messages.length > PAGE_SIZE,
  });
});

// route   POST /api/chats/:id/messages
router.post("/:id/messages", async (req, res) => {
  const me = await getMyProfile(req);
  const meId = me._id.toString();
  const conversation = await loadConversation(req.params.id, meId);
  const text = String(req.body.text || "").trim();
  if (!text) throw badRequest("Message can't be empty.");
  if (text.length > 4000) throw badRequest("Messages can be up to 4000 characters.");

  const friendId = otherParticipant(conversation, meId);
  if (!friendIds(me).includes(friendId)) {
    throw forbidden("You can only message your friends.");
  }

  const message = await ChatMessage.create({
    conversation: conversation._id,
    sender: me._id,
    text,
  });
  conversation.lastMessage = { text, sender: me._id, createdAt: message.createdAt };
  conversation.lastRead.set(meId, message.createdAt);
  await conversation.save();

  const payload = {
    message: serializeMessage(message),
    sender: { _id: meId, name: me.name, profilePic: me.profilePic },
  };
  conversation.participants.forEach((id) => emitTo(id, "chat:message", payload));
  res.status(201).json(payload.message);
});

// route   POST /api/chats/:id/read
// desc    Mark the conversation as read and let the other person know
router.post("/:id/read", async (req, res) => {
  const me = await getMyProfile(req);
  const meId = me._id.toString();
  const conversation = await loadConversation(req.params.id, meId);
  const at = new Date();
  await Conversation.updateOne(
    { _id: conversation._id },
    { $set: { [`lastRead.${meId}`]: at } },
    { timestamps: false }
  );
  const payload = { conversationId: conversation._id.toString(), profileId: meId, at };
  conversation.participants.forEach((id) => emitTo(id, "chat:read", payload));
  res.json(payload);
});

module.exports = router;
