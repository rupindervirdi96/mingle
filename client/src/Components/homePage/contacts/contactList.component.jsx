import React, { useEffect } from "react";
import "./contactList.style.scss";
import UserButton from "../../Button/UserButton/userButton.component";
import { useSelector } from "react-redux";

const ContactList = () => {
  const { friends } = useSelector((state) => ({
    friends: state.profile?.friends,
  }));
  return (
    <div className="contactss">
      <div className="lists">
        <h1>Contacts</h1>
        {friends.map((friend, key) => {
          return <UserButton key={key} profile={friend} />;
        })}
      </div>
    </div>
  );
};
export default ContactList;
