import React, { useState } from "react";
import "./chatSection.style.scss";
import ChatBtn from "./chatBtn/chatBtn.component";
import FriendList from "./friendList/friendList.component";
const ChatSection = () => {
  const [clicked, setClicked] = useState(false);
  return (
    <div className="chat-section">
      <div className="chats"></div>
      <div className="friends">
        {clicked ? <FriendList style="block" /> : <FriendList style="none" />}
        <ChatBtn
          Click={() => {
            clicked ? setClicked(false) : setClicked(true);
          }}
        />
      </div>
    </div>
  );
};
export default ChatSection;
