import { FETCH_USER, NEW_USER, SET_USER } from "./types";
import axios from "axios";


// export const fetchUser = () => dispatch => {
//     axios.get("http://localhost:5000/user/login")
//         .then(response => response.data)
//         .then(users => dispatch({
//             type: FETCH_USER,
//             data: users
//         }))
//         .catch(error => console.log("Error: " + error))
// }
export const loginUser = (loginInfo) => async dispatch => {
    // 
    try {
        localStorage.clear();

        const res = await axios.post("http://localhost:5000/auth/", loginInfo)
        localStorage.setItem('auth', JSON.stringify(res.data.token));

        window.location = "/profile";
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

export const setUser = (auth) => async dispatch => {
    try {

        axios.defaults.headers.common['x-auth-token'] = auth;
        const res2 = await axios.get('http://localhost:5000/auth/')
        console.log(res2.data);
        dispatch(
            {
                type: SET_USER,
                data: res2.data,
            }
        )
        delete axios.defaults.headers.common['x-auth-token'];
    } catch (error) {
        console.log(error);

    }
}