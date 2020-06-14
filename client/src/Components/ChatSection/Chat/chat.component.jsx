import React, { useState, useEffect } from "react";
import { ReactComponent as Emoji } from "../../../svg/emoji.svg";
import cross from "../../../assets/cross.png";
import "./chat.style.scss";
import io, { Socket } from "socket.io-client";
import send from "../../../assets/send.png";
import Message from "./message.component";
import { useSelector, useDispatch } from "react-redux";
import {
  sendMessage,
  getMessages,
  removeChat,
} from "../../../actions/messageActions";

let socket = Socket;
function Chat({ chat }) {
  const { profile } = useSelector((state) => ({
    profile: state.users.profile,
  }));

  const [text, setText] = useState();

  const dispatch = useDispatch();

  const sendMessages = async (e) => {
    e.preventDefault();
    const data = {
      id: chat.friend.id,
      text: text,
      userid: profile.user.toString(),
    };

    // console.log(data);
    await dispatch(sendMessage(data));
    document.querySelector(".messageText").value = "";
    // dispatch(getMessages(chat.friend.id));
  };

  useEffect(() => {
    document
      .querySelector(".messagesWindow")
      .scrollTo(0, document.querySelector(".messagesWindow").scrollHeight);
    document.querySelector(".messageText").focus();
    const data = {
      id: chat.friend.id,
      text: text,
      userid: profile.user.toString(),
    };
    // dispatch(getMessages(data));
  }, []);
  return (
    <div className="Chat-Container">
      <div className="chat-box">
        <div className="contactDetails">
          <div
            className="profilePic"
            style={{ backgroundImage: `url(${chat.friend.profPic})` }}
          ></div>
          <span>{chat.friend.name}</span>
          <div
            onClick={() => {
              dispatch(removeChat(chat.friend.id));
            }}
            style={{
              width: "20px",
              height: "20px",
              backgroundImage: `url(${cross})`,
              backgroundPosition: "center",
              backgroundSize: "center",
            }}
          ></div>
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
              className="messageText"
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

// const useSocket = (serverUrl, topic) => {
//   const [temp, setTemp] = React.useState(0);
//   const [isConnected, setConnected] = React.useState(false);

//   React.useEffect(() => {
//     const client = socket.connect(serverUrl);
//     client.on("connect", () => setConnected(true));
//     client.on("disconnect", () => setConnected(false));
//     client.on(topic, (data) => {
//       setTemp(data);
//     });
//   }, [serverUrl, topic, isConnected]);

//   return { temp, isConnected };
// };
