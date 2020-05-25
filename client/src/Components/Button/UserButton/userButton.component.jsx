import React from "react";
import "./userButton.style.scss";

const UserButton = ({ user, img }) => {
  return (
    <div className="userBtn">
      <button>
        <img src={img} height="30px" width="30px" alt="" />
        <span>{user.firstName}</span>
        <div className="status"></div>
      </button>
    </div>
  );
};

export default UserButton;
