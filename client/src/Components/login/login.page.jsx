import React from "react";
import "./login-page.style.scss";
import NavBar from "./navBar/navBar.component";
import Register from "./register/register.component";

const Login = () => {
  return (
    <div className="main">
      <NavBar />
      <Register />
    </div>
  );
};
export default Login;
