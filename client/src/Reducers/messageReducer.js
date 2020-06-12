import { NEW_CHAT, NEW_MESSAGE } from "../actions/types";


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
            // console.log(action.data);
            return {
                ...state,
                chatsOpen: state.chatsOpen.map(chat => {
                    console.log(chat.friend.id, action.data.id);

                    if (chat.friend.id === action.data.id) {
                        return { ...chat, messages: action.data.messages }
                    }
                    return chat
                }),
            }
        default:
            return state;
    }
}


