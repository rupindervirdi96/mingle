import React, { useEffect } from "react";
import "./feed.style.scss";
import CreatePost from "../../CreatePost/create-post.component";
import Post from "../../Post/post.component";
import tempPostImg from "../../../assets/temp-default-img.png";
import tempPostImg2 from "../../../assets/temp-default-img2.png";
import { useSelector, useDispatch } from "react-redux";
import { getMyPosts } from "../../../actions/postAction";

const Feed = () => {
  const { profile, posts } = useSelector((state) => ({
    profile: state.users.profile,
    posts: state.posts.FriendsPost,
  }));

  return (
    <div className="feed-container">
      <CreatePost profile={profile} />
      {posts.map((post, key) => {
        return <Post key={key} post={post} />;
      })}
    </div>
  );
};

export default Feed;
