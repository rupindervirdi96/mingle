import React, { useState } from "react";
import "./create-post.style.scss";
import feeling from "../../assets/feeling.png";
import tag from "../../assets/tag.png";
import profilePic from "../../assets/profile.png";
import { useDispatch } from "react-redux";
import { addPost } from "../../actions/postAction";

const CreatePost = ({ profile }) => {
  const [imageUrl, setImageUrl] = useState("");
  const OnClickMessageBox = () => {
    if (
      document.querySelector(".post-text-message").innerText ===
      `What's on your mind, ${profile.name}?`
    ) {
      document.querySelector(".post-text-message").innerText = "";
    }
  };

  const imgUrl = (e) => {
    setImageUrl(e.target.value);
  };

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    const text = document.querySelector(".post-text-message").innerText;
    const image = imageUrl;
    dispatch(addPost(text, image));
    window.location.reload();
  };

  return (
    <div className="create-post">
      <form className="create-post-form" action="" onSubmit={onSubmit}>
        <div className="textPost">
          <img src={profile.profilePic} alt="" />
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
            <li
              onClick={() => {
                let input = (document.querySelector(".addImage").style =
                  "flex:3;opacity:1;transition:200ms all linear");
              }}
            >
              <img
                src="https://static.xx.fbcdn.net/rsrc.php/v3/yc/r/7v6BHTdGI6G.png"
                height="20px"
                alt=""
              />
              Add Photo
            </li>
            <input
              type="text"
              className="addImage"
              onChange={imgUrl}
              placeholder="Add Image url"
            />
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
