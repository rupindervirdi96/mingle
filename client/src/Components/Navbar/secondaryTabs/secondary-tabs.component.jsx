import React from "react";
import "./secondary-tabs.style.scss";
import add from "../../../assets/more.png";
import more from "../../../assets/bottom arrow.png";
import { Link } from "react-router-dom";

const SecondaryTabs = ({ name }) => {
  return (
    <div className="Secondary-Tabs">
      <Link to="/profile">
        <div className="user-profile">
          <span className="user-name">Welcome, {name}</span>
        </div>
      </Link>
      <ul type="none">
        {/* <li className="create">
          <img src={add} height="20px" alt="" />
          <div className="create-menu"></div>
        </li> */}
        <li className="more-options">
          <img src={more} height="20px" alt="" />
          <div className="more-options-menu"></div>
        </li>
      </ul>
    </div>
  );
};

export default SecondaryTabs;
