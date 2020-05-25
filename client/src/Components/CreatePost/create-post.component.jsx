import React, { useState } from "react";
import "./create-post.style.scss";
import feeling from "../../assets/feeling.png";
import tag from "../../assets/tag.png";
import profile from "../../assets/profile.png";
import Axios from "axios";
import { addPost } from "../../actions/postAction";
import { useSelector, useDispatch } from "react-redux";

const CreatePost = ({ name }) => {
  const { CurrentUserName } = useSelector((state) => ({}));

  const dispatch = useDispatch();

  const OnClickMessageBox = () => {
    if (
      document.querySelector(".post-text-message").innerText ===
      `Whats on your mind ${name}?`
    ) {
      document.querySelector(".post-text-message").innerText = "";
    }
  };

  const [text, setText] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // const text = document.querySelector(".post-text-message").innerText;
    // const post = {
    //   creator: "Rupinder",
    //   text: text,
    //   likes: ["person1", "person2"],
    //   comments: ["Comment1", "Comment2"],
    // };

    dispatch(addPost({ text }));
    setText("");
  };

  return (
    <div className="create-post">
      <form action="" onSubmit={onSubmit}>
        <div className="textPost">
          <img src={profile} alt="" />
          <div className="postText">
            <textarea
              placeholder="Whats on your mind?"
              className="post-text-message"
              // contentEditable="true"
              onChange={(e) => setText(e.target.value)}
              value={text}
              // onClick={OnClickMessageBox}
              suppressContentEditableWarning={true}
            >
              Whats on your mind {name}?
            </textarea>
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
          <button type="submit" className="post-btn">
            POST
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
