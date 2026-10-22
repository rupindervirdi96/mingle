import { createSlice } from "@reduxjs/toolkit";
import api from "../api/client";
import { thunk } from "./thunk";

export const fetchNotifications = thunk("notifications/fetch", async ({ more = false } = {}, { getState }) => {
  const { items } = getState().notifications;
  const before = more ? items[items.length - 1]?.createdAt : undefined;
  return (await api.get("/notifications", { params: { before } })).data;
});

export const markAllRead = thunk("notifications/readAll", async () => (await api.post("/notifications/read-all")).data);

export const markNotificationRead = thunk(
  "notifications/read",
  async (id) => (await api.post(`/notifications/${id}/read`)).data
);

export const deleteNotification = thunk(
  "notifications/delete",
  async (id) => (await api.delete(`/notifications/${id}`)).data
);

const setRead = (state, id) => {
  const item = state.items.find((n) => n._id === id);
  if (item && !item.read) {
    item.read = true;
    state.unread = Math.max(0, state.unread - 1);
  }
};

const remove = (state, id) => {
  const item = state.items.find((n) => n._id === id);
  if (item && !item.read) state.unread = Math.max(0, state.unread - 1);
  state.items = state.items.filter((n) => n._id !== id);
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { items: [], unread: 0, hasMore: false, loaded: false, loading: false },
  reducers: {
    // socket "notification:new"
    notificationReceived(state, { payload }) {
      if (state.items.some((n) => n._id === payload._id)) return;
      state.items.unshift(payload);
      if (!payload.read) state.unread += 1;
    },
    // socket "notification:removed" (an unlike, a cancelled request...)
    notificationRemoved(state, { payload }) {
      const known = state.items.some((n) => n._id === payload._id);
      if (known) remove(state, payload._id);
    },
    // socket "notification:read" from another tab
    notificationRead(state, { payload }) {
      if (payload.all) {
        state.items.forEach((n) => {
          n.read = true;
        });
        state.unread = 0;
      } else {
        setRead(state, payload._id);
      }
    },
    notificationsReset() {
      return notificationsSlice.getInitialState();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, { payload, meta }) => {
        state.items = meta.arg?.more
          ? [...state.items, ...payload.items.filter((n) => !state.items.some((x) => x._id === n._id))]
          : payload.items;
        state.unread = payload.unread;
        state.hasMore = payload.hasMore;
        state.loaded = true;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      })
      .addCase(markAllRead.pending, (state) => {
        state.items.forEach((n) => {
          n.read = true;
        });
        state.unread = 0;
      })
      .addCase(markNotificationRead.pending, (state, { meta }) => setRead(state, meta.arg))
      .addCase(deleteNotification.pending, (state, { meta }) => remove(state, meta.arg));
  },
});

export const { notificationReceived, notificationRemoved, notificationRead, notificationsReset } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
