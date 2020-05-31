import React from "react";
import "./main-tabs.style.scss";
import { Link } from "react-router-dom";
import { ReactComponent as HomeIcon } from "../../../svg/home.svg";
import { ReactComponent as FriendsIcon } from "../../../svg/friends.svg";
import profilePic from "../../../assets/profile.png";
// import { ReactComponent as HomeIcon } from "../../../svg/home.svg";
// import { ReactComponent as HomeIcon } from "../../../svg/home.svg";
// import { ReactComponent as HomeIcon } from "../../../svg/home.svg";

const MainTabs = () => {
  return (
    <div className="main-tabs-container">
      <ul type="none">
        <Link to="/home">
          <li>
            <HomeIcon />
          </li>
        </Link>
        <Link to="/friends">
          <li>
            <FriendsIcon fill="#000000" />
          </li>
        </Link>
        <Link to="/profile">
          <li>
            <img
              style={{ borderRadius: "50%" }}
              src={profilePic}
              height="40px"
              alt=""
            />
          </li>
        </Link>
        <Link to="/home">
          <li>
            <HomeIcon />
          </li>
        </Link>
        <Link to="/home">
          <li>
            <HomeIcon />
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default MainTabs;
