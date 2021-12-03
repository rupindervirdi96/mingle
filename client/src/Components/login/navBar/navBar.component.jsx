import React from "react";
import "./navBar.style.scss";
import Login from "../login/login.component";

const NavBar = () => {
  return (
    <div className="nav-bar-container">
      <div className="nav-bar-login">
        <span className="title-app">MiNGLE</span>
        <Login />
      </div>
    </div>
  );
};
export default NavBar;
