import React from "react";
import "./post.style.scss";
import profile from "../../assets/profile.png";
const Post = ({ nbLikes, nbComments, img, text, creator }) => {
  return (
    <div className="post">
      <div className="creator">
        <img src={profile} height="40px" alt="" />
        <span>{creator}</span>
      </div>

      <div className="content">
        <div className="text">{text}</div>
        <div className="image">
          <img src={img} alt="" />
        </div>
      </div>
      <div className="likeComment">
        <div className="likeCommentCounter">
          <span className="nbLikes">{nbLikes} likes</span>
          <span className="nbComments">{nbComments} comments</span>
        </div>
        <hr />
        <ul type="none">
          <li>Like</li>
          <li>Comment</li>
        </ul>
        {/* <input type="file" accept="image/*" /> */}
      </div>
    </div>
  );
};

export default Post;
