import React, { useEffect } from "react";
import Contacts from "./Contacts/contacts.component";
import Profile from "../ProfilePage/profile-page.component";
import "./contacts.page.style.scss";
import { useSelector, useDispatch } from "react-redux";
import { setUser, getProfile } from "../../actions/userActions";
import { getSuggestions } from "../../actions/profileActions";
import Default from "./default/default.component";

const ContactsPage = () => {
  const { suggestions, profile, friendsProfile } = useSelector((state) => ({
    profile: state.users.profile,
    friendsProfile: state.users.friendsProfile,
    suggestions: state.profile.suggestions,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUser(JSON.parse(localStorage.getItem("auth"))));
    dispatch(getSuggestions());
  }, [dispatch]);

  return (
    <div className="contacts-page">
      <div className="contacts">
        <h1 style={{ paddingLeft: "8px" }}>Friends</h1>
        <h3 style={{ paddingLeft: "8px" }}>Requests</h3>
        {
          // console.log(profile.contacts.requests.length)
          profile.contacts.requests.length > 0 ? (
            profile.contacts.requests.map((contact, key) => {
              if (contact.status === "received") {
                return (
                  <Contacts
                    openProfile={(id) => {
                      dispatch(getProfile(id));
                    }}
                    contact={contact}
                    key={key}
                    status="received"
                  />
                );
              }
            })
          ) : (
            <span style={{ paddingLeft: "8px" }}>No new requests for you.</span>
          )
        }
        <h3 style={{ paddingLeft: "8px" }}>Suggestions</h3>
        {suggestions.map((contact, key) => {
          return (
            <Contacts
              openProfile={(id) => {
                dispatch(getProfile(id));
              }}
              contact={contact}
              key={key}
            />
          );
        })}
      </div>
      {Object.keys(friendsProfile).length === 0 ? (
        <Default />
      ) : (
        <Profile friendsProfile={friendsProfile} />
      )}
    </div>
  );
};

export default ContactsPage;
