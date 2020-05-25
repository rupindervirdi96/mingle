import React, { useEffect } from "react";
import "./feed.style.scss";
import CreatePost from "../../CreatePost/create-post.component";
import Post from "../../Post/post.component";
import tempPostImg from "../../../assets/temp-default-img.png";
import tempPostImg2 from "../../../assets/temp-default-img2.png";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../../../actions/postAction";

const Feed = () => {
  const { posts, user } = useSelector((state) => ({
    posts: state.posts.posts,
    user: state.users.currentUser,
  }));
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  return (
    <div className="feed-container">
      <CreatePost name={"Rupinder"} />
      {posts.map((post, key) => (
        <Post
          key={key}
          creator={post.creator}
          text={post.text}
          img={tempPostImg2}
          nbLikes={post.likes.length}
          nbComments={post.comments.length}
        />
      ))}
    </div>
  );
};

export default Feed;
