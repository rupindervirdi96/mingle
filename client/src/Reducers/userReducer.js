import { FETCH_USER, SET_USER } from "../actions/types";


const initialState = {
    profile: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return {
                ...state, profile: action.data
            }

        default:
            return state;
    }
}