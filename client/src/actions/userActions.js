import { SET_FRIEND, SET_USER } from "./types";
import axios from "axios";



export const loginUser = (loginInfo) => async dispatch => {
    // 
    try {
        localStorage.removeItem('auth');
        const res = await axios.post("http://localhost:5000/auth/", loginInfo)
        localStorage.setItem('auth', JSON.stringify(res.data.token));
        window.location = "/home";
    } catch (error) {
        console.log("Errorr" + error.message);
    }

}
export const register = (user) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const body = JSON.stringify(user);

        const res = await axios.post(
            "http://localhost:5000/users/",
            body,
            config
        );
        console.log(res);
    } catch (error) {
        console.log(error.message);
    }
}

export const setUser = auth => async dispatch => {
    try {

        axios.defaults.headers.common['x-auth-token'] = auth;
        const res = await axios.get('http://localhost:5000/auth/')
        dispatch(
            {
                type: SET_USER,
                data: res.data,
            }
        )
        delete axios.defaults.headers.common['x-auth-token'];
    } catch (error) {
        console.log(error);

    }
}
export const getProfile = (id) => async dispatch => {
    try {
        axios.defaults.headers.common['x-auth-token'] = JSON.parse(localStorage.getItem('auth'));
        const res = await axios.get(`http://localhost:5000/profile/${id}`);
        // console.log(res.data);
        dispatch(
            {
                type: SET_FRIEND,
                data: res.data,
            }
        )
        delete axios.defaults.headers.common['x-auth-token'];
    } catch (error) {
        console.log(error);
    }
}