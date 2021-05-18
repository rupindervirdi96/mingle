import { GET_SUGGESTIONS, GET_FRIENDS, GET_REQUESTS, GET_INFO } from "./types";
import axios from "axios";

export const getSuggestions = () => async (dispatch) => {
  axios.defaults.headers.common["x-auth-token"] = JSON.parse(
    sessionStorage.getItem("auth")
  );
  const res = await axios.get(" /profile/update/suggestions");

  dispatch({
    type: GET_SUGGESTIONS,
    data: res.data,
  });
};

export const getAllFriends = () => async (dispatch) => {
  axios.defaults.headers.common["x-auth-token"] = JSON.parse(
    sessionStorage.getItem("auth")
  );
  const res = await axios.get(" /profile/friends/get");
  dispatch({
    type: GET_FRIENDS,
    data: res.data,
  });
};
export const getAllRequests = () => async (dispatch) => {
  axios.defaults.headers.common["x-auth-token"] = JSON.parse(
    sessionStorage.getItem("auth")
  );
  const res = await axios.get(" /profile/requests/get");

  dispatch({
    type: GET_REQUESTS,
    data: res.data,
  });
};

export const getInfo = () => async (dispatch) => {
  axios.defaults.headers.common["x-auth-token"] = JSON.parse(
    sessionStorage.getItem("auth")
  );
  const res = await axios.get(" /profile/info/getinfo");
  dispatch({
    type: GET_INFO,
    data: res.data,
  });
};

export const setProfilePic = (photo) => async (dispatch) => {
  console.log(photo);
  const data = {
    pic: photo,
  };

  axios.defaults.headers.common["x-auth-token"] = JSON.parse(
    sessionStorage.getItem("auth")
  );
  await axios.post(" /profile/photo/prof", data);
};

export const setCoverPic = (photo) => async (dispatch) => {
  const data = {
    pic: photo,
  };
  axios.defaults.headers.common["x-auth-token"] = JSON.parse(
    sessionStorage.getItem("auth")
  );
  await axios.post(" /profile/photo/cover", data);
};
