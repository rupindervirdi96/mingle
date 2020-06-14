import React from "react";
import "./main-tabs.style.scss";
import { Link } from "react-router-dom";
import { ReactComponent as HomeIcon } from "../../../svg/home.svg";
import { ReactComponent as FriendsIcon } from "../../../svg/friends.svg";
import hamburger from "../../../svg/hamburger.svg";
import { removeFriendsProfile } from "../../../actions/userActions";
import { useDispatch } from "react-redux";

const MainTabs = ({ profile }) => {
  const dispatch = useDispatch();

  const onClickHam = () => {
    var list = document.querySelector(".dropDownList");
    if (list.classList.contains("displayList")) {
      list.classList.remove("displayList");
    } else {
      list.classList.add("displayList");
    }
  };

  return (
    <div className="main-tabs-container">
      <div
        className="hamburger"
        style={{ backgroundImage: `url(${hamburger})` }}
        onClick={onClickHam}
      ></div>
      <ul className="dropDownList" type="none">
        <li
          style={{
            backgroundColor: "#00000000",
            color: "#fff",
            textTransform: "uppercase",
          }}
        >
          HEY, {profile.name}
        </li>
        <Link to="/home">
          <li
            onClick={() => {
              var list = document.querySelector(".dropDownList");
              list.classList.remove("displayList");
            }}
          >
            HOME
          </li>
        </Link>
        <Link to="/profile">
          <li
            onClick={() => {
              var list = document.querySelector(".dropDownList");
              list.classList.remove("displayList");
              dispatch(removeFriendsProfile());
            }}
          >
            PROFILE
          </li>
        </Link>
        <Link to="/friends">
          <li
            onClick={() => {
              var list = document.querySelector(".dropDownList");
              list.classList.remove("displayList");
            }}
          >
            FRIENDS
          </li>
        </Link>
      </ul>
      <ul className="tabs-list" type="none">
        <Link to="/home">
          <li>
            <HomeIcon />
          </li>
        </Link>
        <Link to="/profile">
          <li onClick={() => dispatch(removeFriendsProfile())}>
            <div
              style={{
                backgroundImage: `url(${profile.profilePic})`,
                borderRadius: "50%",
                height: "40px",
                width: "40px",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            ></div>
          </li>
        </Link>
        <Link to="/friends">
          <li>
            <FriendsIcon fill="#000000" />
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default MainTabs;
