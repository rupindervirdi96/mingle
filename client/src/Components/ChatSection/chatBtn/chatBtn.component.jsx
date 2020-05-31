import React from "react";
import "./chatBtn.style.scss";
import message from "../../../assets/message1.png";

const ChatBtn = ({ Click }) => {
  return (
    <div onClick={Click} className="chatButton">
      <button className="chatBtn">
        <img src={message} height="34px" width="34px" alt="" />
      </button>
    </div>
  );
};

export default ChatBtn;
