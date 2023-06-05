import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as Emoji } from "../../../svg/emoji.svg";
import cross from "../../../assets/cross.png";
import "./chat.style.scss";
import io from "socket.io-client";
import send from "../../../assets/send.png";
import Message from "./message.component";
import { useSelector, useDispatch } from "react-redux";
import { removeChat } from "../../../actions/messageActions";

function Chat({ chat }) {
  const { profile } = useSelector((state) => ({
    profile: state.users.profile,
  }));

  const [currChat, UpdateCurrChat] = useState(chat);
  const [text, setText] = useState("");

  const dispatch = useDispatch();
  const sendMessages = async (e) => {
    e.preventDefault();
    let data = {
      id: chat.friend.id,
      text: text,
      userid: profile?.user.toString(),
    };
    if (!(data.text === "")) {
      io("http://localhost:5000").emit("send message", data);
      document.querySelector(".messageText").value = "";
    }
  };

  useEffect(() => {
    io("http://localhost:5000").on(
      "output chat message",
      async ({ message, data }) => {
        await UpdateCurrChat(data);

        document
          .querySelector(".messagesWindow")
          .scrollTo(0, document.querySelector(".messagesWindow").scrollHeight);
        document.querySelector(".messageText").focus();
      }
    );
    document
      .querySelector(".messagesWindow")
      .scrollTo(0, document.querySelector(".messagesWindow").scrollHeight);
    document.querySelector(".messageText").focus();
  }, []);
  return (
    <div className="chatContainer">
      {/* <div className="chat-box"> */}
      <form action="" onSubmit={sendMessages}>
        <div className="contactDetails">
          <div
            className="profilePic"
            style={{ backgroundImage: `url(${chat.friend.profPic})` }}
          ></div>
          <span>{chat.friend.name.split(" ")[0]}</span>
          <div
            onClick={() => {
              dispatch(removeChat(chat.friend.id));
            }}
            style={{
              width: "20px",
              height: "20px",
              backgroundImage: `url(${cross})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              borderRadius: "50%",
            }}
          ></div>
        </div>
        <div className="messagesWindow">
          {currChat.messages.map((message, key) => {
            if (message.sender.toString() === profile?._id.toString()) {
              return <Message key={key} align="right" text={message.text} />;
            } else {
              return <Message key={key} align="left" text={message.text} />;
            }
          })}
        </div>
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
      {/* </div> */}
    </div>
  );
}

export default Chat;
