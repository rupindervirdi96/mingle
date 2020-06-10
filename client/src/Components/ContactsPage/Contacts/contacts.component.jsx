import React, { useState } from "react";
import profilePic from "../../../assets/profile.png";
import "./contacts.style.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Contacts = ({ status, contact, openProfile, type }) => {
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
