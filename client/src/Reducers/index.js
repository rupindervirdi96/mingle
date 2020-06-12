import { combineReducers } from "redux";
import userReducer from "./userReducer";
import postReducer from "./postReducer";
import profileReducer from "./profileReducer";
import messageReducer from "./messageReducer";


export default combineReducers({
    users: userReducer,
    posts: postReducer,
    profile: profileReducer,
    messages: messageReducer
})

// export default rootReducer;