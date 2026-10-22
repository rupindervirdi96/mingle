import { createSlice } from "@reduxjs/toolkit";
import api from "../api/client";
import { thunk } from "./thunk";

export const fetchFriends = thunk("friends/fetch", async () => (await api.get("/friends")).data);

export const fetchSuggestions = thunk("friends/suggestions", async () => (await api.get("/friends/suggestions")).data);

// Every mutation returns the new relationship and refreshes the lists.
const mutation = (type, request) =>
  thunk(type, async (profileId, { dispatch }) => {
    const { data } = await request(profileId);
    dispatch(fetchFriends());
    return data.relationship;
  });

export const sendRequest = mutation("friends/send", (id) => api.post(`/friends/requests/${id}`));
export const acceptRequest = mutation("friends/accept", (id) => api.post(`/friends/requests/${id}/accept`));
export const removeRequest = mutation("friends/removeRequest", (id) => api.delete(`/friends/requests/${id}`));
export const unfriend = mutation("friends/unfriend", (id) => api.delete(`/friends/${id}`));

const friendsSlice = createSlice({
  name: "friends",
  initialState: {
    friends: [],
    received: [],
    sent: [],
    suggestions: [],
    loaded: false,
    suggestionsLoaded: false,
    // profileId -> true for friends who currently have Mingle open
    online: {},
  },
  reducers: {
    presenceList(state, { payload }) {
      state.online = Object.fromEntries(payload.map((id) => [id, true]));
    },
    presenceChanged(state, { payload: { profileId, online } }) {
      if (online) state.online[profileId] = true;
      else delete state.online[profileId];
    },
    friendsReset() {
      return friendsSlice.getInitialState();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.fulfilled, (state, { payload }) => {
        state.friends = payload.friends;
        state.received = payload.received;
        state.sent = payload.sent;
        state.loaded = true;
        payload.friends.forEach((f) => {
          if (f.online) state.online[f._id] = true;
        });
      })
      .addCase(fetchSuggestions.fulfilled, (state, { payload }) => {
        state.suggestions = payload;
        state.suggestionsLoaded = true;
      })
      .addCase(sendRequest.fulfilled, (state, { meta }) => {
        state.suggestions = state.suggestions.filter((s) => s._id !== meta.arg);
      });
  },
});

export const { presenceList, presenceChanged, friendsReset } = friendsSlice.actions;
export default friendsSlice.reducer;
