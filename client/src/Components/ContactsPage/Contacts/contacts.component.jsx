import React from "react";
import profilePic from "../../../assets/profile.png";
import "./contacts.style.scss";

const Contacts = ({ status, contact, openProfile }) => {
  const acceptRequest = () => {
    console.log("Accepted");
  };

  const sendRequest = () => {
    console.log(contact._id);
  };

  const deleteRequest = () => {
    console.log("Deleted");
  };

  return (
    <div className="contact">
      <img src={profilePic} alt="" />
      <div className="contact-info">
        <span
          className="name"
          onClick={() => {
            status === "received"
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
          ) : (
            <button onClick={sendRequest} className="btnAddFriend">
              Add Friend
            </button>
          )}
          <button onClick={deleteRequest} className="btnRemove">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
