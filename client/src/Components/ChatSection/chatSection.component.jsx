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
      <div className="friends">
        <ChatBtn
          Click={() => {
            var chats = document.querySelector(".chats");
            chats.classList.contains("hidden")
              ? chats.classList.remove("hidden")
              : chats.classList.add("hidden");
            var chatCont = document.querySelector(".chat-section");
            chatCont.classList.contains("minimizeChat")
              ? chatCont.classList.remove("minimizeChat")
              : chatCont.classList.add("minimizeChat");
          }}
        />
      </div>
    </div>
  );
};
export default ChatSection;
