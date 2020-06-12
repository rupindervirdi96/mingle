import React, { useState, useEffect } from "react";
import { ReactComponent as Emoji } from "../../../svg/emoji.svg";
import { ReactComponent as Cross } from "../../../svg/cross.svg";
import "./chat.style.scss";
import openSocket from "socket.io-client";
import send from "../../../assets/send.png";
import Message from "./message.component";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage, getMessages } from "../../../actions/messageActions";

function Chat({ chat }) {
  const { profile } = useSelector((state) => ({
    profile: state.users.profile,
  }));

  const [text, setText] = useState();

  const dispatch = useDispatch();

  const sendMessages = (e) => {
    e.preventDefault();
    // const socket=io();
    let messageBody = document.querySelector(".messagesWindow");
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    const data = {
      id: chat.friend.id,
      text: text,
    };

    dispatch(sendMessage(data));
    console.log(chat);
  };

  return (
    <div className="Chat-Container">
      <div className="chat-box">
        <div className="contactDetails">
          <div
            className="profilePic"
            style={{ backgroundImage: `url(${chat.friend.profPic})` }}
          ></div>
          <span>{chat.friend.name}</span>
          <Cross />
        </div>
        <div className="messagesWindow">
          {chat.messages.map((message, key) => {
            if (message.sender.toString() == profile._id.toString()) {
              return <Message key={key} align="right" text={message.text} />;
            } else {
              return <Message key={key} align="left" text={message.text} />;
            }
          })}
        </div>
        <form action="" onSubmit={sendMessages}>
          <div className="textBox">
            <Emoji />
            <input
              type="text"
              onChange={(e) => {
                setText(e.target.value);
              }}
              placeholder="Type your message"
            />
            <img
              onClick={sendMessages}
              height="25px"
              width="25px"
              src={send}
              alt=""
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
