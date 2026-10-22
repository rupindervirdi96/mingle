import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import auth from "./authSlice";
import posts from "./postsSlice";
import friends from "./friendsSlice";
import chat from "./chatSlice";
import notifications from "./notificationsSlice";
import ui from "./uiSlice";

const store = configureStore({
  reducer: { auth, posts, friends, chat, notifications, ui },
});

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
export const useMe = () => useSelector((state) => state.auth.profile);
export const useOnline = (profileId) => useSelector((state) => Boolean(state.friends.online[profileId]));

export default store;
