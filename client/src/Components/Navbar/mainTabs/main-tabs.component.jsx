import React from "react";
import "./main-tabs.style.scss";
import bell from "../../../assets/bell.png";
import home from "../../../assets/home.png";
import messenger from "../../../assets/messenger.png";
import { Link } from "react-router-dom";

const MainTabs = ({ name }) => {
  return (
    <div className="main-tabs-container">
      <ul type="none">
        <Link to="/home">
          <li>
            <img height="35px" src={home} alt="" />
          </li>
        </Link>
        <Link to="/home">
          <li onClick={name}>
            <img height="35px" src={bell} alt="" />
          </li>
        </Link>
        <Link to="/home">
          <li>
            <img height="35px" src={messenger} alt="" />
          </li>
        </Link>
        <Link to="/home">
          <li>
            <img height="35px" src={messenger} alt="" />
          </li>
        </Link>
        <Link to="/home">
          <li>
            <img height="35px" src={messenger} alt="" />
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default MainTabs;
