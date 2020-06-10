import React from "react";
import "./post.style.scss";
import profileIm from "../../assets/profile.png";
import { likePost } from "../../actions/postAction";
import { useDispatch, useSelector } from "react-redux";
import like from "../../assets/like.png";

const Post = ({ post }) => {
  const { profile } = useSelector((state) => ({
    profile: state.users.profile,
  }));
  const dispatch = useDispatch();
  const LikePost = () => {
    dispatch(likePost(post._id.toString()));
    window.location.reload();
  };
  return (
    <div className="post">
      <div className="creator">
        {post.profile == profile._id ? (
          <img src={profile.profilePic} alt="" />
        ) : (
          <img src={post.profPic} alt="" />
        )}
        <span>{post.name}</span>
      </div>

      <div className="content">
        <div className="text">{post.text}</div>
        <div className="image">
          <img src={post.image} alt="" />
        </div>
      </div>
      <div className="likeComment">
        <div className="likeCommentCounter">
          <span className="nbLikes">
            <span>{post.likes.length}</span>
            <img height="35px" src={like} alt="" />
            <div></div>
          </span>
          <span className="nbComments">{post.comments.length} comments</span>
        </div>
        <hr />
        <ul type="none">
          <li onClick={LikePost}>Like</li>
          <li>Comment</li>
        </ul>
        {/* <input type="file" accept="image/*" /> */}
      </div>
    </div>
  );
};

export default Post;
