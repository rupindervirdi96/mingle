import React from "react";
import { useSelector } from "react-redux";
import Friend from "./friend.component";
import "./friendsList.style.scss";

function FriendList({}) {
  const { friends } = useSelector((state) => ({
    friends: state.profile?.friends,
  }));

  return (
    <div className="friend-list">
      <h2>Friends</h2>
      <div className="frnds">
        {friends.map((friend, key) => {
          return <Friend key={key} prof={friend} />;
        })}
      </div>
    </div>
  );
}

export default FriendList;
