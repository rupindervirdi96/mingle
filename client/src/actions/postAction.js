import { FETCH_POSTS, ADD_POST } from "./types";
import Axios from "axios";


export const fetchPosts = () => dispatch => {
    Axios.get("http://localhost:5000/post/fetchPosts")
        .then(response => response.data)
        .then(posts => {
            dispatch({
                type: FETCH_POSTS,
                data: posts
            })
            console.log(posts)
        }
        ).catch(error => console.log("Error: " + error)
        )
}
export const addPost = (post) => async dispatch => {

    try {
        const res = await Axios.post("http://localhost:5000/post/addPost", post)



        dispatch({
            type: ADD_POST,
            data: res.data
        })

    } catch (error) {
        console.log(error.message);
    }

    // .then((res) => console.log(res.data))
    // .catch((error) => "Error : " + console.log(error));
    // fetchPosts();
}


