import React, { useState } from "react";
import "./chatSection.style.scss";
import ChatBtn from "./chatBtn/chatBtn.component";
import Chat from "./Chat/chat.component";
import FriendList from "./friendList/friendList.component";
import { useSelector } from "react-redux";
const ChatSection = ({ profile }) => {
  const { chatsOpen } = useSelector((state) => ({
    chatsOpen: state.messages.chatsOpen,
  }));
  return (
    <div className="chat-section">
      <div className="chats">
        {chatsOpen.map((chat, key) => {
          return <Chat key={key} chat={chat} />;
        })}
      </div>
    </div>
  );
};
export default ChatSection;
