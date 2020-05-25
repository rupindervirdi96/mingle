import React, { useEffect, useState } from "react";
import "./login.style.scss";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, setUser } from "../../../actions/userActions";
import axios from "axios";

const Login = () => {
  const [currentInfo, changeCurrentInfo] = useState({
    email: "",
    password: "",
  });

  // const { auth, currentUser } = useSelector((state) => ({
  //   currentUser: state.users.currentUser,
  // }));

  const dispatch = useDispatch();

  const onChangeEmail = (e) => {
    changeCurrentInfo({ ...currentInfo, email: e.target.value });
  };

  const onChangePassword = (e) => {
    changeCurrentInfo({ ...currentInfo, password: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let loginInfo = {
      email: currentInfo.email,
      password: currentInfo.password,
    };
    dispatch(loginUser(loginInfo));
  };
  return (
    <div className="login-component">
      <form action="" onSubmit={onSubmit}>
        <div className="email">
          <span>username</span>
          <input type="text" onChange={onChangeEmail} placeholder="username" />
        </div>
        <div className="password">
          <span>password</span>
          <input
            type="password"
            onChange={onChangePassword}
            placeholder="password"
          />
          <span>forget password</span>
        </div>
        <div className="loginBtn">
          <input type="submit" value="Login" />
        </div>
      </form>
    </div>
  );
};

export default Login;
