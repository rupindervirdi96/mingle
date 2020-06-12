import { NEW_CHAT, NEW_MESSAGE } from "./types";

import axios from "axios";


export const getMessages = (chatId) => async dispatch => {
    axios.defaults.headers.common['x-auth-token'] = JSON.parse(sessionStorage.getItem('auth'));
    var res = await axios.get(`http://localhost:5000/messages/${chatId}`)
    console.log(res.data);

    dispatch(
        {
            type: NEW_CHAT,
            data: res.data
        }
    )
}
export const sendMessage = (data) => async dispatch => {
    axios.defaults.headers.common['x-auth-token'] = JSON.parse(sessionStorage.getItem('auth'));
    var res = await axios.post(`http://localhost:5000/messages/`, data);
    console.log(res.data);
    dispatch({
        type: NEW_MESSAGE,
        data: res.data
    })
    // console.log(res.data);
    // getMessages
}