import React from "react";
import "./contacts.style.scss";
import axios from "axios";

const Contacts = ({ status, contact, openProfile }) => {
  const acceptRequest = () => {
    axios.defaults.headers.common["x-auth-token"] = JSON.parse(
      sessionStorage.getItem("auth")
    );
    const res = axios.put(
      `http://localhost:5000/profile/update/friends/accept/${contact.id}`
    );
    window.location.reload();
    // console.log(res);
    delete axios.defaults.headers.common["x-auth-token"];
  };

  const sendRequest = () => {
    axios.defaults.headers.common["x-auth-token"] = JSON.parse(
      sessionStorage.getItem("auth")
    );

    const res = axios.put(
      `http://localhost:5000/profile/update/friends/request/${contact._id}`
    );
    window.location.reload();
    delete axios.defaults.headers.common["x-auth-token"];
  };

  const deleteRequest = () => {
    console.log(contact);
  };

  return (
    <div className="contact">
      {status == "received" || status == "friend" ? (
        <div
          style={{
            backgroundImage: `url(${contact.photo})`,
            borderRadius: "50%",
            height: "40px",
            width: "40px",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        ></div>
      ) : (
        <div
          style={{
            backgroundImage: `url(${contact.profilePic})`,
            borderRadius: "50%",
            height: "40px",
            width: "40px",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        ></div>
      )}
      <div className="contact-info">
        <span
          className="name"
          onClick={() => {
            status === "received" || status === "friend"
              ? openProfile(contact.id)
              : openProfile(contact._id);
          }}
        >
          {contact.name}
        </span>

        <div className="buttons">
          {status === "received" ? (
            <button onClick={acceptRequest} className="btnAcceptReq">
              Accept
            </button>
          ) : status === "friend" ? (
            ""
          ) : (
            <button onClick={sendRequest} className="btnAddFriend">
              Add Friend
            </button>
          )}
          {/* <button onClick={deleteRequest} className="btnRemove">
            Remove
          </button> */}
        </div>
      </div>
    </div>
  );
};
export default Contacts;
