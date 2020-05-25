import React from "react";
import "./login-page.style.scss";
import NavBar from "./navBar/navBar.component";
import Register from "./register/register.component";
import Footer from "./footer/footer.component";

const Login = () => {
  return (
    <div className="main">
      <NavBar />
      <Register />
      <Footer />
    </div>
  );
};
export default Login;
