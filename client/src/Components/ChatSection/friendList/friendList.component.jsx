import React from "react";
import UserButton from "../../Button/UserButton/userButton.component";
import "./friendList.style.scss";

const FriendList = ({ profile }) => {
  return (
    <div className="friend-list-container">
      <span className="friends-heading">Friends</span>
      <ul type="none" className="friend-list">
        {profile.map((profile, key) => (
          <UserButton key={key} prof={profile} />
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
