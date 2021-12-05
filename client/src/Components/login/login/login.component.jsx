import React, { useState } from "react";
import "./login.style.scss";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../actions/userActions";

const Login = () => {
  const [currentInfo, changeCurrentInfo] = useState({
    email: "",
    password: "",
  });

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
      <form onSubmit={onSubmit}>
        <div className="email">
          <label>email</label>
          <input
            type="text"
            onChange={onChangeEmail}
            placeholder="username"
            required
          />
        </div>
        <div className="password">
          <label>password</label>
          <input
            type="password"
            onChange={onChangePassword}
            placeholder="password"
            required
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
