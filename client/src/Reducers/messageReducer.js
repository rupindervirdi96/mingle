import { NEW_CHAT, NEW_MESSAGE, REMOVE_CHAT } from "../actions/types";


const initialState = {
    chatsOpen: [],
}

export default function (state = initialState, action) {
    switch (action.type) {
        case NEW_CHAT:
            console.log(action.data);
            return {
                ...state, chatsOpen: [...state.chatsOpen, action.data]
            }
        case NEW_MESSAGE:
            return {
                ...state,
                chatsOpen: state.chatsOpen.map(chat => {
                    if (chat.friend.id === action.data.id) {
                        return { ...chat, messages: action.data.messages }
                    }
                    return chat
                }),
            }
        case REMOVE_CHAT:
            return { ...state, chatsOpen: state.chatsOpen.filter(chat => chat.friend.id != action.data) }
        default:
            return state;
    }
}


