import { GET_SUGGESTIONS } from "./types";
import axios from "axios";

export const getSuggestions = () => async dispatch => {
    axios.defaults.headers.common['x-auth-token'] = JSON.parse(localStorage.getItem('auth'));
    const res = await axios.get("http://localhost:5000/profile/update/suggestions");

    dispatch(
        {
            type: GET_SUGGESTIONS,
            data: res.data,
        }
    )

}