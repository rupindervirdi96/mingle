import { combineReducers } from "redux";
import userReducer from "./userReducer";
import postReducer from "./postReducer";
import profileReducer from "./profileReducer";


export default combineReducers({
    users: userReducer,
    posts: postReducer,
    profile: profileReducer
})

// export default rootReducer;