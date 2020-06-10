import React, { useEffect } from "react";
import profile from "../../../assets/profile.png";
import { useSelector, useDispatch } from "react-redux";
import UserButton from "../../Button/UserButton/userButton.component";
// import { fetchUser, setUser } from "../../../actions/userActions";
import "./friendList.style.scss";

const FriendList = ({ profile }) => {
  // const { profile } = useSelector((state) => ({
  //   profile: state.users.profile.contacts.friends,
  // }));
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
