import React from "react";
import profile from "../../../assets/profile.png";
import "./info.style.scss";
import Button from "../../Button/button.component";

const info = () => {
  return (
    <div className="info-container">
      <h2>Intro</h2>
      <ul type="none">
        <li>
          <img src={profile} height="20px" alt="" />
          <span>Studied at D.A.V College</span>
        </li>
        <li>
          <img src={profile} height="20px" alt="" />
          <span>Studies at C T Public School</span>
        </li>
        <li>
          <img src={profile} height="20px" alt="" />
          <span>Lives in Montreal, Quebec</span>
        </li>
        <li>
          <img src={profile} height="20px" alt="" />
          <span>From Jalandhar, India</span>
        </li>
        <li>
          <img src={profile} height="20px" alt="" />
          <span>Single</span>
        </li>
      </ul>
      <Button name="Edit Details" />
    </div>
  );
};

export default info;
