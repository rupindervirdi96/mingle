import { tokenStore } from "../api/client";
import { connectSocket, disconnectSocket } from "../socket";
import { loggedOut } from "./authSlice";
import { chatReset, fetchConversations } from "./chatSlice";
import { fetchFriends, friendsReset } from "./friendsSlice";
import { fetchNotifications, notificationsReset } from "./notificationsSlice";
import { postsReset } from "./postsSlice";

// Everything that should happen once a user is signed in.
export const startSession = () => (dispatch, getState) => {
  connectSocket({ dispatch, getState }, { onUnauthorized: () => dispatch(logout()) });
  dispatch(fetchFriends());
  dispatch(fetchConversations());
  dispatch(fetchNotifications());
};

export const logout = () => (dispatch) => {
  tokenStore.set(null);
  disconnectSocket();
  dispatch(postsReset());
  dispatch(friendsReset());
  dispatch(chatReset());
  dispatch(notificationsReset());
  dispatch(loggedOut());
};
