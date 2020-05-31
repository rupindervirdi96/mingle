import { SET_USER, SET_FRIEND } from "../actions/types";


const initialState = {
    profile: {},
    friendsProfile: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return {
                ...state, profile: action.data
            }
        case SET_FRIEND:
            return {
                ...state, friendsProfile: action.data
            }
        default:
            return state;
    }
}