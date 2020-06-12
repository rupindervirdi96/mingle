import React from "react";
import "./userButton.style.scss";
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
      if (chat.friend.id == id) {
        Open = true;
      }
    });
    if (!Open) {
      dispatch(getMessages(id));
    }
  };
  return (
    <div
      className="userBtn"
      onClick={() => {
        getAllMessages(profile);
      }}
    >
      <button>
        <img src={profile.photo} height="30px" width="30px" alt="" />
        <span>{profile.name}</span>
        <div className="status"></div>
      </button>
    </div>
  );
};

export default UserButton;
