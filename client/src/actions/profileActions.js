import {
  GET_SUGGESTIONS,
  GET_FRIENDS,
  GET_REQUESTS,
  GET_INFO,
  UPDATE_COVER_PIC,
  UPDATE_PROFILE_PIC,
} from "./types";
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
  const data = {
    pic: photo,
  };

  axios.defaults.headers.common["x-auth-token"] = JSON.parse(
    sessionStorage.getItem("auth")
  );
  const res = await axios.post("/profile/photo/prof", data);
  dispatch({
    type: UPDATE_PROFILE_PIC,
    data: res.data,
  });
};

export const setCoverPic = (photo) => async (dispatch) => {
  const data = {
    pic: photo,
  };
  axios.defaults.headers.common["x-auth-token"] = JSON.parse(
    sessionStorage.getItem("auth")
  );
  const res = await axios.post("/profile/photo/cover", data);

  dispatch({
    type: UPDATE_COVER_PIC,
    data: res.data,
  });
};

export const uploadImage = (file) => async (dispatch) => {
  let formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "dyzi4adq");
  let res = await fetch(
    "https://api.cloudinary.com/v1_1/dinspdp3w/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );
  res = await res.json();
  return res.url;
};
