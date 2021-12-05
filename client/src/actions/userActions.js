import { SET_FRIEND, SET_USER, SET_STATUS, VERIFY } from "./types";
import axios from "axios";

export const loginUser = (loginInfo) => async (dispatch) => {
  //
  try {
    const res = await axios.post("/auth/", loginInfo);
    sessionStorage.setItem("auth", JSON.stringify(res.data.token));
    window.location = "/home";
  } catch (error) {
    alert(error.message);
  }
};
export const register = (user) => async (dispatch) => {
  let res;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify(user);
    res = await axios.post("/users/", body, config);
    if (res.data.error) {
      alert(res.data.error);
    } else {
      alert(res.data.msg);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const setUser = (auth) => async (dispatch) => {
  try {
    axios.defaults.headers.common["x-auth-token"] = auth;
    const res = await axios.get(" /auth/");
    dispatch({
      type: SET_USER,
      data: res.data,
    });
    delete axios.defaults.headers.common["x-auth-token"];
  } catch (error) {
    console.log(error);
  }
};
export const getProfile = (id) => async (dispatch) => {
  try {
    axios.defaults.headers.common["x-auth-token"] = JSON.parse(
      sessionStorage.getItem("auth")
    );
    const res = await axios.get(`/profile/${id}`);
    dispatch({
      type: SET_FRIEND,
      data: res.data,
    });
    delete axios.defaults.headers.common["x-auth-token"];
  } catch (error) {
    console.log(error);
  }
};

export const changeStatus = (newStat) => async (dispatch) => {
  axios.defaults.headers.common["x-auth-token"] = JSON.parse(
    sessionStorage.getItem("auth")
  );
  console.log("HEllo");
  const res = await axios.put(" /profile/update/status", { status: newStat });
  console.log(res);

  dispatch({
    type: SET_STATUS,
    data: res.data,
  });
  delete axios.defaults.headers.common["x-auth-token"];
};

export const removeFriendsProfile = () => (dispatch) => {
  const obj = {};
  dispatch({
    type: SET_FRIEND,
    data: obj,
  });
};

export const verify = (email) => async (dispatch) => {
  const res = await axios.post("/users/verify", { email: email });
  console.log(res.data);
  // dispatch({
  //   type: VERIFY,
  //   data: res.data.secretCode,
  // });
};
