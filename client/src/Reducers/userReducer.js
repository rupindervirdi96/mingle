import { SET_USER, SET_FRIEND, SET_STATUS } from "../actions/types";


const initialState = {
    profile: {},
    friendsProfile: {}
}

export default function (state = initialState, action) {
    const { type, data } = action;
    switch (type) {
        case SET_USER:
            return {
                ...state, profile: data
            }
        case SET_FRIEND:
            return {
                ...state, friendsProfile: data
            }
        case SET_STATUS:
            const profileEdited = { ...state };
            profileEdited.status = data
            return {
                ...state, profile: profileEdited
            }
        default:
            return state;
    }
}