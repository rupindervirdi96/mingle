import {
  GET_MY_POSTS,
  GET_POSTS_FOR_ANY_USER,
  GET_FRIENDS_POSTS,
  ADD_POST,
  LIKE_POST,
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
    case ADD_POST: {
      let newPosts = [data, ...state.FriendsPost].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      return {
        ...state,
        FriendsPost: newPosts,
        MyPosts: [data, ...state.MyPosts],
      };
    }
    case LIKE_POST: {
      const { post } = data;
      let posts = state.FriendsPost.map((p) => (p._id === post._id ? post : p));
      let myposts = state.MyPosts.map((p) => (p._id === post._id ? post : p));
      let userPosts = state.UserPosts.map((p) =>
        p._id === post._id ? post : p
      );
      return {
        ...state,
        FriendsPost: posts,
        MyPosts: myposts,
        UserPosts: userPosts,
      };
    }
    default:
      return state;
  }
}
