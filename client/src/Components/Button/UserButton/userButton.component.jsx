import React from "react";
import "./userButton.style.scss";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../../../actions/messageActions";

const UserButton = ({ profile }) => {
  const { chatsOpen } = useSelector((state) => ({
    chatsOpen: state.messages.chatsOpen,
  }));
  const dispatch = new useDispatch();
  const getAllMessages = (prof) => {
    var Open = false;
    const id = prof.id.toString();
    chatsOpen.forEach((chat) => {
      if (chat.friend.id === id) {
        Open = true;
      }
    });
    if (!Open) {
      io().on("message", (data) => {
        alert(data.text);
      });
      dispatch(getMessages(id));
    }
  };
  return (
    <div
      className="userBtn"
      onClick={() => {
        getAllMessages(profile);
        var chats = document.querySelector(".chats");
        chats.classList.remove("hidden");
      }}
    >
      <button>
        <div
          style={{
            backgroundImage: `url(${profile?.photo})`,
            borderRadius: "50%",
            height: "40px",
            width: "40px",
            marginRight: "10px",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        ></div>
        <span>{profile?.name}</span>
        <div className="status"></div>
      </button>
    </div>
  );
};

export default UserButton;
