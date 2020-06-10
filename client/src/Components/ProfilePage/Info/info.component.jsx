import React, { useState } from "react";
import "./info.style.scss";
import Button from "../../Button/button.component";
import { useSelector } from "react-redux";
import InfoTab from "./infotab/infotab.component";
const Info = ({ click }) => {
  const { info, friendsProfile } = useSelector((state) => ({
    info: state.profile.info,
    friendsProfile: state.users.friendsProfile,
  }));
  return (
    <div className="info-container">
      <h2>Intro</h2>
      <ul type="none">
        {Object.keys(friendsProfile).length === 0 ? (
          info.length > 0 ? (
            info.map((info, key) => {
              return <InfoTab info={info} type={info.type} />;
            })
          ) : (
            <div>
              <div>Click Edit Details to add Info</div>
            </div>
          )
        ) : (
          friendsProfile.info.map((info) => {
            return <InfoTab info={info} type={info.type} />;
          })
        )}
        {Object.keys(friendsProfile).length === 0 ? (
          <Button name="Edit Details" click={click} />
        ) : (
          ""
        )}
      </ul>
    </div>
  );
};

export default Info;
