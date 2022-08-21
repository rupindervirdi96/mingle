import React from "react";
import "./post.style.scss";
import { likePost } from "../../actions/postAction";
import { useDispatch, useSelector } from "react-redux";
import like from "../../assets/like.png";
import moment from "moment";

const Post = ({ post }) => {
  const { profile } = useSelector((state) => ({
    profile: state.users.profile,
  }));
  const dispatch = useDispatch();

  const onClickLike = () => {
    dispatch(likePost(post._id?.toString()));
  };
  return (
    <div className="post">
      <div className="creator">
        {post.profile === profile?._id ? (
          <div
            style={{
              backgroundImage: `url(${profile?.profilePic})`,
              borderRadius: "50%",
              height: "40px",
              width: "40px",
              marginRight: "10px",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          ></div>
        ) : (
          <div
            style={{
              backgroundImage: `url(${post.profPic})`,
              borderRadius: "50%",
              marginRight: "10px",
              height: "40px",
              width: "40px",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          ></div>
        )}
        <span>{post.name}</span>
        <span style={{ fontSize: "12px", color: "#777" }}>
          {moment(post.date).format("MMM Do YY,  h:mm a")}
        </span>
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
            <span>{post.likes?.length}</span>
            <img height="30px" src={like} alt="" />
          </span>
        </div>
        <hr />
        <ul type="none">
          <li onClick={onClickLike}>
            {post.likes.includes(profile?._id) ? "Unlike" : "Like"}
          </li>
          <li>Comment</li>
          <li>Share</li>
        </ul>
      </div>
    </div>
  );
};

export default Post;
