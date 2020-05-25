// import { FETCH_POSTS, ADD_POST } from "../actions/types";
import { FETCH_POSTS, ADD_POST } from "../actions/types"


const initialState = {
    posts: [],
    // latestPost: {}
}

export default function (state = initialState, { type, data }) {
    switch (type) {
        case FETCH_POSTS:
            return {
                ...state, posts: data
            }
        case ADD_POST:
            return {
                ...state, posts: [data, ...state.posts]
            }

        default:
            return state;
    }
}