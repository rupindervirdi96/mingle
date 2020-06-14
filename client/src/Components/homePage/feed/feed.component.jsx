import React, { useEffect } from "react";
import "./feed.style.scss";
import CreatePost from "../../CreatePost/create-post.component";
import Post from "../../Post/post.component";
import { useSelector } from "react-redux";

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
