import {
  GET_MY_POSTS,
  GET_POSTS_FOR_ANY_USER,
  GET_FRIENDS_POSTS,
  ADD_POST,
  LIKE_POST,
} from "./types";
import axios from "axios";

export const getMyPosts = () => async (dispatch) => {
  try {
    axios.defaults.headers.common["x-auth-token"] = JSON.parse(
      sessionStorage.getItem("auth")
    );
    const res = await axios.get("/posts/");
    const data = res.data.reverse();
    dispatch({
      type: GET_MY_POSTS,
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getPostsForAnyUser = (id) => async (dispatch) => {
  try {
    const res = await axios.get(` /posts/getpost/${id}`);
    const data = res.data.reverse();
    dispatch({
      type: GET_POSTS_FOR_ANY_USER,
      data: data,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllPostsForFriends = () => async (dispatch) => {
  try {
    axios.defaults.headers.common["x-auth-token"] = JSON.parse(
      sessionStorage.getItem("auth")
    );
    const res = await axios.get(`/posts/friends`);
    const data = res.data.reverse();
    dispatch({
      type: GET_FRIENDS_POSTS,
      data: data,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const likePost = (id) => async (dispatch) => {
  try {
    axios.defaults.headers.common["x-auth-token"] = JSON.parse(
      sessionStorage.getItem("auth")
    );
    const res = await axios.post(`/posts/like/${id}`);
    dispatch({
      type: LIKE_POST,
      data: res.data,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const addPost = (text, image) => async (dispatch) => {
  try {
    axios.defaults.headers.common["x-auth-token"] = JSON.parse(
      sessionStorage.getItem("auth")
    );

    const res = await axios.post(`/posts/`, {
      text,
      image,
    });

    dispatch({
      type: ADD_POST,
      data: res.data,
    });
  } catch (error) {
    console.log("ERROR", error.message);
  }
};
