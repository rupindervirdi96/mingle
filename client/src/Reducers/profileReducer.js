import { GET_SUGGESTIONS } from "../actions/types";


const initialState = {
    suggestions: [],
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_SUGGESTIONS:

            return {
                ...state, suggestions: action.data
            }
        default:
            return state;
    }
}