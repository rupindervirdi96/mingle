import React, { useEffect, useState } from "react";
import Contacts from "./Contacts/contacts.component";
import Profile from "../ProfilePage/profile-page.component";
import "./contacts.page.style.scss";
import { useSelector, useDispatch } from "react-redux";
import { setUser, getProfile } from "../../actions/userActions";
import { getSuggestions } from "../../actions/profileActions";
import { getPostsForAnyUser } from "../../actions/postAction";
import Default from "./default/default.component";

const ContactsPage = ({ profile }) => {
  const { friendsProfile, suggestions, requests } = useSelector((state) => ({
    friendsProfile: state.users.friendsProfile,
    suggestions: state.profile.suggestions,
    requests: state.profile.requests,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSuggestions());
  }, []);

  return (
    <div className="contacts-page">
      <div className="contacts">
        <h1 style={{ paddingLeft: "8px" }}>Friends</h1>
        <h3 style={{ paddingLeft: "8px" }}>{requests.length} Friend Request</h3>
        {requests.length > 0 ? (
          requests.map((request, key) => {
            if (request.status === "received") {
              return (
                <Contacts
                  openProfile={(id) => {
                    dispatch(getProfile(id));
                    dispatch(getPostsForAnyUser(id));
                  }}
                  contact={request}
                  key={key}
                  status="received"
                />
              );
            }
          })
        ) : (
          <span style={{ paddingLeft: "8px" }}>No new requests for you.</span>
        )}
        <h3 style={{ paddingLeft: "8px" }}>People you may know</h3>
        {suggestions.map((contact, key) => {
          return (
            <Contacts
              openProfile={(id) => {
                dispatch(getProfile(id));
                dispatch(getPostsForAnyUser(id));
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
        <Profile friendsProfile={friendsProfile} profile={profile} />
      )}
    </div>
  );
};

export default ContactsPage;
