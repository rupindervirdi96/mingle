import { SET_FRIEND, SET_USER, SET_STATUS } from "./types";
import axios from "axios";



export const loginUser = (loginInfo) => async dispatch => {
    // 
    try {
        const res = await axios.post("http://localhost:5000/auth/", loginInfo)
        sessionStorage.setItem('auth', JSON.stringify(res.data.token));
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
        axios.defaults.headers.common['x-auth-token'] = JSON.parse(sessionStorage.getItem('auth'));
        const res = await axios.get(`http://localhost:5000/profile/${id}`);
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

export const changeStatus = (newStat) => async dispatch => {
    axios.defaults.headers.common['x-auth-token'] = JSON.parse(sessionStorage.getItem('auth'));
    console.log("HEllo");
    const res = await axios.put("http://localhost:5000/profile/update/status", { status: newStat });
    console.log(res);

    dispatch(
        {
            type: SET_STATUS,
            data: res.data,
        }
    )
    delete axios.defaults.headers.common['x-auth-token'];
}

export const removeFriendsProfile = () => dispatch => {
    const obj = {}
    dispatch(
        {
            type: SET_FRIEND,
            data: obj,
        }
    )
}