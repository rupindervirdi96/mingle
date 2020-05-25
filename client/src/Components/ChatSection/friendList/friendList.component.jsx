import React, { useEffect } from "react";
import profile from "../../../assets/profile.png";
import { useSelector, useDispatch } from "react-redux";
import UserButton from "../../Button/UserButton/userButton.component";
// import { fetchUser, setUser } from "../../../actions/userActions";
import "./friendList.style.scss";

const FriendList = ({ style }) => {
  const { users } = useSelector((state) => ({
    users: state.users.users,
  }));
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(fetchUser());
  //   console.log(style);
  // }, []);

  return (
    <div style={{ display: style }} className="friend-list-container">
      <span className="friends-heading">Friends</span>
      <ul type="none" className="friend-list">
        {users.map((user, key) => (
          <UserButton key={key} user={user} img={profile} />
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
