import { io } from "socket.io-client";
import { tokenStore } from "./api/client";
import {
  fetchConversations,
  markRead,
  messageReceived,
  readReceived,
  typingChanged,
} from "./store/chatSlice";
import { fetchFriends, fetchSuggestions, presenceChanged, presenceList } from "./store/friendsSlice";
import {
  fetchNotifications,
  notificationRead,
  notificationReceived,
  notificationRemoved,
} from "./store/notificationsSlice";
import { postReceived } from "./store/postsSlice";
import { toast } from "./store/uiSlice";
import { showDesktop } from "./lib/desktop";
import { describe, plainText } from "./lib/notificationText";

let socket = null;
const typingTimers = {};

export function connectSocket(store, { onUnauthorized }) {
  disconnectSocket();
  const { dispatch, getState } = store;
  const meId = () => getState().auth.profile?._id;
  let connectedBefore = false;

  socket = io({ auth: { token: tokenStore.get() } });

  socket.on("connect", () => {
    // After a reconnect, catch up on anything missed while offline.
    if (connectedBefore) {
      dispatch(fetchConversations());
      dispatch(fetchNotifications());
      dispatch(fetchFriends());
    }
    connectedBefore = true;
  });

  socket.on("connect_error", (error) => {
    if (error.message === "unauthorized") onUnauthorized();
  });

  socket.on("presence:list", (ids) => dispatch(presenceList(ids)));
  socket.on("presence", (payload) => dispatch(presenceChanged(payload)));

  socket.on("chat:message", ({ message, sender }) => {
    const state = getState();
    const known = state.chat.conversations.some((c) => c._id === message.conversation);
    dispatch(messageReceived({ message, meId: meId() }));
    if (!known) dispatch(fetchConversations());
    if (message.sender === meId()) return;

    const viewing = state.chat.activeId === message.conversation;
    if (viewing && !document.hidden) {
      dispatch(markRead(message.conversation));
      return;
    }
    const link = `/messages/${sender._id}`;
    if (!viewing) {
      dispatch(toast({ title: sender.name, body: message.text, avatar: sender.profilePic, name: sender.name, link }));
    }
    showDesktop({ title: sender.name, body: message.text, icon: sender.profilePic, link, tag: message.conversation });
  });

  socket.on("chat:read", (payload) => dispatch(readReceived({ ...payload, meId: meId() })));

  socket.on("chat:typing", (payload) => {
    dispatch(typingChanged(payload));
    clearTimeout(typingTimers[payload.conversationId]);
    if (payload.typing) {
      // Clear the indicator if the "stopped typing" event never arrives.
      typingTimers[payload.conversationId] = setTimeout(
        () => dispatch(typingChanged({ ...payload, typing: false })),
        6000
      );
    }
  });

  socket.on("notification:new", (notification) => {
    dispatch(notificationReceived(notification));
    const { verb, quote, link } = describe(notification);
    dispatch(
      toast({
        title: notification.actor.name,
        body: quote ? `${verb} “${quote}”` : verb,
        avatar: notification.actor.profilePic,
        name: notification.actor.name,
        link,
      })
    );
    showDesktop({
      title: "Mingle",
      body: plainText(notification),
      icon: notification.actor.profilePic,
      link,
      tag: notification._id,
    });
    if (notification.type.startsWith("friend_")) dispatch(fetchFriends());
  });
  socket.on("notification:removed", (payload) => dispatch(notificationRemoved(payload)));
  socket.on("notification:read", (payload) => dispatch(notificationRead(payload)));

  socket.on("friends:update", () => {
    dispatch(fetchFriends());
    if (getState().friends.suggestionsLoaded) dispatch(fetchSuggestions());
  });

  socket.on("post:new", (post) => dispatch(postReceived(post)));

  return socket;
}

export function emitTyping(conversationId, typing) {
  if (socket?.connected) socket.emit("chat:typing", { conversationId, typing });
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}
