import {
  SET_USER,
  SET_FRIEND,
  SET_STATUS,
  VERIFY,
  UPDATE_COVER_PIC,
  UPDATE_PROFILE_PIC,
} from "../actions/types";

const initialState = {
  profile: null,
  friendsProfile: {},
  verificationKey: "",
};

export default function (state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case SET_USER:
      return {
        ...state,
        profile: data,
      };
    case SET_FRIEND:
      return {
        ...state,
        friendsProfile: data,
      };
    case SET_STATUS:
      const profileEdited = { ...state };
      profileEdited.status = data;
      return {
        ...state,
        profile: profileEdited,
      };
    case VERIFY:
      return {
        ...state,
        verificationKey: data,
      };
    case UPDATE_COVER_PIC: {
      let { profile } = state;
      profile.coverPic = data;
      return {
        ...state,
        Profile: profile,
      };
    }
    case UPDATE_PROFILE_PIC: {
      let { profile } = state;
      profile.profilePic = data;
      console.log(profile);
      return {
        ...state,
        Profile: profile,
      };
    }

    default:
      return state;
  }
}
