import React, { useState } from "react";
import "./register.style.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { register } from "../../../actions/userActions";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    birthdate: "",
  });

  const dispatch = useDispatch();

  //////////////////////////////////////////////////
  const handleChange = (date) => {
    setUser({ ...user, birthdate: date });
  };

  const onChangeName = (e) => {
    setUser({ ...user, name: e.target.value });
  };

  const onChangePassword = (e) => {
    setUser({ ...user, password: e.target.value });
  };
  const onChangeEmail = (e) => {
    setUser({ ...user, email: e.target.value });
  };
  //////////////////////////////////////////////////

  const onSubmit = async (e) => {
    e.preventDefault();
    const User = {
      name: user.name,
      email: user.email,
      password: user.password,
      birthdate: user.birthdate,
    };
    var Gender = document.getElementsByName("gender");
    Gender.forEach((gen) => {
      if (gen.checked) {
        User.gender = gen.value;
      }
    });
    dispatch(register(User));
  };

  return (
    <div className="register-container">
      <div className="register">
        <div className="registerForm">
          <h1>Create a New Account</h1>
          <h3>It's quick and easy.</h3>
          <form action="" onSubmit={onSubmit}>
            {/* <div className="name"> */}
            <input
              type="text"
              placeholder="Name"
              onChange={onChangeName}
              required
            />
            {/* </div> */}
            <input
              type="email"
              placeholder="Email"
              onChange={onChangeEmail}
              required
            />
            <input
              type="password"
              placeholder="Password"
              autoComplete="false"
              onChange={onChangePassword}
              required
            />
            <h3>Birthday</h3>
            <div>
              {" "}
              <DatePicker
                dateFormat="MM/dd/yyyy"
                selected={user.birthdate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="gender">
              <h3>Gender</h3>
              <div className="genders">
                <div className="male">
                  <input type="radio" name="gender" value="Male" checked />
                  <label>Male</label>
                </div>
                <div className="female">
                  <input type="radio" name="gender" value="Female" />
                  <label>Female</label>
                </div>
              </div>
            </div>
            <input type="submit" value="Sign Up" />
          </form>
        </div>
        <div className="AppDescription"></div>
      </div>
    </div>
  );
};

export default Register;
