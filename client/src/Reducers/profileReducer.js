import {
  GET_SUGGESTIONS,
  GET_FRIENDS,
  GET_REQUESTS,
  GET_INFO,
} from "../actions/types";

const initialState = {
  suggestions: [],
  friends: [],
  requests: [],
  info: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SUGGESTIONS:
      return {
        ...state,
        suggestions: action.data,
      };
    case GET_FRIENDS:
      return {
        ...state,
        friends: action.data,
      };
    case GET_REQUESTS:
      return {
        ...state,
        requests: action.data,
      };
    case GET_INFO:
      return {
        ...state,
        info: action.data,
      };
    default:
      return state;
  }
}
