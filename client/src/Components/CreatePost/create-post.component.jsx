import React from "react";
import "./create-post.style.scss";
import feeling from "../../assets/feeling.png";
import tag from "../../assets/tag.png";
import profilePic from "../../assets/profile.png";
import { useSelector } from "react-redux";

const CreatePost = () => {
  const { profile } = useSelector((state) => ({
    profile: state.users.profile,
  }));

  const OnClickMessageBox = () => {
    if (
      document.querySelector(".post-text-message").innerText ===
      `What's on your mind, ${profile.name}?`
    ) {
      document.querySelector(".post-text-message").innerText = "";
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // const text = document.querySelector(".post-text-message").innerText;
    // const post = {
    //   creator: "Rupinder",
    //   text: text,
    //   likes: ["person1", "person2"],
    //   comments: ["Comment1", "Comment2"],
    // };

    // dispatch(addPost({ text }));
    // setText("");
  };

  return (
    <div className="create-post">
      <form className="create-post-form" action="" onSubmit={onSubmit}>
        <div className="textPost">
          <img src={profilePic} alt="" />
          <div className="postText">
            <div
              className="post-text-message"
              contentEditable
              suppressContentEditableWarning={true}
              onClick={OnClickMessageBox}
            >
              What's on your mind, {profile.name}?
            </div>
          </div>
        </div>
        <hr />
        <div className="attachments">
          <ul type="none">
            <li>
              <img
                src="https://static.xx.fbcdn.net/rsrc.php/v3/yc/r/7v6BHTdGI6G.png"
                height="20px"
                alt=""
              />{" "}
              Photo/Video
            </li>
            <li>
              <img src={tag} height="20px" alt="" /> Tag Friends
            </li>
            <li>
              <img src={feeling} height="20px" alt="" /> Feeling
            </li>
          </ul>
        </div>
        <button type="submit" className="post-btn">
          POST
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
