import React from "react";
import "./userButton.style.scss";

const UserButton = ({ profile }) => {
  return (
    <div className="userBtn">
      <button>
        <img src={profile.photo} height="30px" width="30px" alt="" />
        <span>{profile.name}</span>
        <div className="status"></div>
      </button>
    </div>
  );
};

export default UserButton;
