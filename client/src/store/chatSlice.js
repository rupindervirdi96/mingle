import { createSlice, nanoid } from "@reduxjs/toolkit";
import api from "../api/client";
import { thunk } from "./thunk";

export const fetchConversations = thunk("chat/conversations", async () => (await api.get("/chats")).data);

export const openConversation = thunk(
  "chat/open",
  async (friendId) => (await api.post(`/chats/with/${friendId}`)).data
);

export const fetchMessages = thunk("chat/messages", async ({ conversationId, more = false }, { getState }) => {
  const thread = getState().chat.threads[conversationId];
  const before = more ? thread?.messages.find((m) => !m.pending)?.createdAt : undefined;
  return (await api.get(`/chats/${conversationId}/messages`, { params: { before } })).data;
});

export const sendMessage = thunk(
  "chat/send",
  async ({ conversationId, text }) => (await api.post(`/chats/${conversationId}/messages`, { text })).data,
);

export const markRead = thunk("chat/read", async (conversationId) => (await api.post(`/chats/${conversationId}/read`)).data);

// Adds a temporary id so the message shows instantly while it's being sent.
export const send = ({ conversationId, text }) => (dispatch, getState) =>
  dispatch(
    sendMessage({ conversationId, text, tempId: `temp-${nanoid()}`, meId: getState().auth.profile._id })
  );

// Re-sends a message that failed, keeping its place in the thread.
export const retry = (message) => (dispatch) => {
  dispatch(discardMessage(message));
  return dispatch(send({ conversationId: message.conversation, text: message.text }));
};

const thread = (state, id) => {
  if (!state.threads[id]) state.threads[id] = { messages: [], hasMore: false, loading: false, loaded: false };
  return state.threads[id];
};

const upsertConversation = (state, conversation) => {
  const index = state.conversations.findIndex((c) => c._id === conversation._id);
  if (index >= 0) state.conversations[index] = { ...state.conversations[index], ...conversation };
  else state.conversations.unshift(conversation);
};

// The open conversation is always read; server responses computed a moment
// before the read receipt landed must not bring its badge back.
const clearActiveUnread = (state) => {
  const active = state.conversations.find((c) => c._id === state.activeId);
  if (active) active.unread = 0;
};

const sortConversations = (state) => {
  const time = (c) => new Date(c.lastMessage?.createdAt || c.updatedAt || 0).getTime();
  state.conversations.sort((a, b) => time(b) - time(a));
};

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    loaded: false,
    threads: {},
    // conversationId -> profileId currently typing
    typing: {},
    activeId: null,
  },
  reducers: {
    setActive(state, { payload }) {
      state.activeId = payload;
    },
    // socket "chat:message" — also arrives for messages sent from this account's other tabs.
    messageReceived(state, { payload: { message, meId } }) {
      const id = message.conversation;
      const t = state.threads[id];
      if (t && !t.messages.some((m) => m._id === message._id)) {
        const temp = message.sender === meId
          ? t.messages.find((m) => m.pending && m.text === message.text)
          : null;
        if (temp) Object.assign(temp, message, { pending: false, clientId: temp._id });
        else t.messages.push(message);
      }
      const conversation = state.conversations.find((c) => c._id === id);
      if (conversation) {
        conversation.lastMessage = { text: message.text, sender: message.sender, createdAt: message.createdAt };
        conversation.updatedAt = message.createdAt;
        if (message.sender !== meId && state.activeId !== id) conversation.unread += 1;
        sortConversations(state);
      }
      if (message.sender !== meId) delete state.typing[id];
    },
    readReceived(state, { payload: { conversationId, profileId, at, meId } }) {
      const conversation = state.conversations.find((c) => c._id === conversationId);
      if (!conversation) return;
      if (profileId === meId) conversation.unread = 0;
      else conversation.friendLastRead = at;
    },
    typingChanged(state, { payload: { conversationId, profileId, typing } }) {
      if (typing) state.typing[conversationId] = profileId;
      else delete state.typing[conversationId];
    },
    discardMessage(state, { payload }) {
      const t = state.threads[payload.conversation];
      if (t) t.messages = t.messages.filter((m) => m._id !== payload._id);
    },
    chatReset() {
      return chatSlice.getInitialState();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, { payload }) => {
        // Keep a freshly opened, still-empty conversation that the server doesn't list yet.
        const empty = state.conversations.filter(
          (c) => !c.lastMessage && !payload.some((p) => p._id === c._id)
        );
        state.conversations = [...payload, ...empty];
        state.loaded = true;
        clearActiveUnread(state);
      })
      .addCase(openConversation.fulfilled, (state, { payload }) => {
        upsertConversation(state, payload);
        clearActiveUnread(state);
      })
      .addCase(fetchMessages.pending, (state, { meta }) => {
        thread(state, meta.arg.conversationId).loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, { payload, meta }) => {
        const t = thread(state, meta.arg.conversationId);
        if (meta.arg.more) {
          t.messages = [...payload.messages, ...t.messages];
        } else {
          // Keep messages that arrived over the socket while the page was loading.
          const fresh = t.messages.filter((m) => !payload.messages.some((p) => p._id === m._id));
          t.messages = [...payload.messages, ...fresh];
        }
        t.hasMore = payload.hasMore;
        t.loading = false;
        t.loaded = true;
      })
      .addCase(fetchMessages.rejected, (state, { meta }) => {
        thread(state, meta.arg.conversationId).loading = false;
      })
      .addCase(sendMessage.pending, (state, { meta }) => {
        const { conversationId, text, tempId, meId } = meta.arg;
        thread(state, conversationId).messages.push({
          _id: tempId,
          conversation: conversationId,
          sender: meId,
          text,
          createdAt: new Date().toISOString(),
          pending: true,
        });
      })
      .addCase(sendMessage.fulfilled, (state, { payload, meta }) => {
        const t = thread(state, meta.arg.conversationId);
        const alreadyHere = t.messages.some((m) => m._id === payload._id);
        t.messages = alreadyHere
          ? t.messages.filter((m) => m._id !== meta.arg.tempId)
          : t.messages.map((m) => (m._id === meta.arg.tempId ? { ...payload, clientId: m._id } : m));
        const conversation = state.conversations.find((c) => c._id === meta.arg.conversationId);
        if (conversation) {
          conversation.lastMessage = { text: payload.text, sender: payload.sender, createdAt: payload.createdAt };
          conversation.updatedAt = payload.createdAt;
          sortConversations(state);
        }
      })
      .addCase(sendMessage.rejected, (state, { meta, payload }) => {
        const message = thread(state, meta.arg.conversationId).messages.find((m) => m._id === meta.arg.tempId);
        if (message) {
          message.pending = false;
          message.failed = payload || "Not sent";
        }
      })
      .addCase(markRead.pending, (state, { meta }) => {
        const conversation = state.conversations.find((c) => c._id === meta.arg);
        if (conversation) conversation.unread = 0;
      });
  },
});

export const { setActive, messageReceived, readReceived, typingChanged, discardMessage, chatReset } =
  chatSlice.actions;

export const selectUnreadChats = (state) => state.chat.conversations.filter((c) => c.unread > 0).length;

export default chatSlice.reducer;
