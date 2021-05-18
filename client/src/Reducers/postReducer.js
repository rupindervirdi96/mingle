import {
  GET_MY_POSTS,
  LIKE_POST,
  GET_POSTS_FOR_ANY_USER,
  GET_FRIENDS_POSTS,
} from "../actions/types";

const initialState = {
  MyPosts: [],
  FriendsPost: [],
  UserPosts: [],
};

export default function (state = initialState, { type, data }) {
  switch (type) {
    case GET_MY_POSTS:
      return {
        ...state,
        MyPosts: data,
      };
    case GET_POSTS_FOR_ANY_USER:
      return {
        ...state,
        UserPosts: data,
      };
    case GET_FRIENDS_POSTS:
      return {
        ...state,
        FriendsPost: data,
      };
    default:
      return state;
  }
}
