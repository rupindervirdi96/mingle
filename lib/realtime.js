const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const config = require("config");
const Profile = require("../models/profile.model");
const Conversation = require("../models/conversation.model");
const { friendIds } = require("./profiles");

let io = null;
// profileId -> number of open sockets (a user can have several tabs open)
const connections = new Map();

const room = (profileId) => `profile:${profileId}`;

const isOnline = (profileId) => connections.has(String(profileId));

const emitTo = (profileId, event, payload) => {
  if (io) io.to(room(String(profileId))).emit(event, payload);
};

const emitToMany = (profileIds, event, payload) => {
  if (io && profileIds.length) {
    io.to(profileIds.map((id) => room(String(id)))).emit(event, payload);
  }
};

// Keeps presence broadcasts accurate after friendships change mid-session.
const setFriends = async (profileId, ids) => {
  if (!io) return;
  const sockets = await io.in(room(String(profileId))).fetchSockets();
  sockets.forEach((socket) => {
    socket.data.friendIds = ids.map(String);
  });
};

const init = (server) => {
  io = new Server(server, {
    cors: { origin: true, credentials: true },
  });

  // Every socket must present the same JWT the REST API uses.
  io.use(async (socket, next) => {
    try {
      const { token } = socket.handshake.auth || {};
      const { user } = jwt.verify(token, config.get("jwtSecret"));
      const profile = await Profile.findOne({ user: user.id }).select(
        "_id contacts.friends"
      );
      if (!profile) return next(new Error("unauthorized"));
      socket.data.profileId = profile._id.toString();
      socket.data.friendIds = friendIds(profile);
      next();
    } catch (error) {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const { profileId } = socket.data;
    socket.join(room(profileId));

    const count = (connections.get(profileId) || 0) + 1;
    connections.set(profileId, count);
    if (count === 1) {
      emitToMany(socket.data.friendIds, "presence", { profileId, online: true });
    }
    socket.emit("presence:list", socket.data.friendIds.filter(isOnline));

    socket.on("chat:typing", async ({ conversationId, typing } = {}) => {
      try {
        const conversation = await Conversation.findById(conversationId).select(
          "participants"
        );
        if (!conversation) return;
        const ids = conversation.participants.map(String);
        if (!ids.includes(profileId)) return;
        ids
          .filter((id) => id !== profileId)
          .forEach((id) =>
            emitTo(id, "chat:typing", {
              conversationId,
              profileId,
              typing: Boolean(typing),
            })
          );
      } catch (error) {
        // Ignore malformed ids from the client.
      }
    });

    socket.on("disconnect", async () => {
      const remaining = (connections.get(profileId) || 1) - 1;
      if (remaining > 0) {
        connections.set(profileId, remaining);
        return;
      }
      connections.delete(profileId);
      // Friends may have changed during the session, so look them up again.
      const profile = await Profile.findById(profileId)
        .select("contacts.friends")
        .catch(() => null);
      const ids = profile ? friendIds(profile) : socket.data.friendIds;
      emitToMany(ids, "presence", { profileId, online: false });
    });
  });

  return io;
};

module.exports = { init, emitTo, emitToMany, isOnline, setFriends };
