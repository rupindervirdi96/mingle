import React, { useState } from "react";
import "./create-post.style.scss";
import { useDispatch } from "react-redux";
import { addPost } from "../../actions/postAction";
import { uploadImage } from "../../actions/profileActions";

const CreatePost = ({ profile }) => {
  const [attachment, setAttachment] = useState();

  const OnClickMessageBox = () => {
    if (
      document.querySelector(".post-text-message").innerText ===
      `What's on your mind, ${profile?.name}?`
    ) {
      document.querySelector(".post-text-message").innerText = "";
    }
  };

  const imgUrl = (e) => {
    setAttachment(e.target.files[0]);
  };

  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    const text = document.querySelector(".post-text-message").innerText;
    let image;
    if (attachment) {
      image = await dispatch(uploadImage(attachment));
    }
    dispatch(addPost(text, image));
  };

  return (
    <div className="create-post">
      <form className="create-post-form" action="" onSubmit={onSubmit}>
        <div className="textPost">
          <div
            className="create-post-picture"
            style={{
              backgroundImage: `url(${profile?.profilePic})`,
              
            }}
          ></div>
          <div className="postText">
            <div
              className="post-text-message"
              contentEditable
              suppressContentEditableWarning={true}
              onClick={OnClickMessageBox}
            >
              What's on your mind, {profile?.name}?
            </div>
          </div>
        </div>
        <hr />
        <div className="attachments">
          <ul type="none">
            <label className="upload-post-attachment" htmlFor="postAttachment">
              <img
                src="https://static.xx.fbcdn.net/rsrc.php/v3/yc/r/7v6BHTdGI6G.png"
                height="20px"
                alt=""
                onChange={(e) => imgUrl(e)}
              />
              Add Photo
            </label>
            <input type="file" id="postAttachment" onChange={imgUrl} />
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
