import React, { useEffect } from "react";
import "./homePage.style.scss";
import Feed from "./feed/feed.component";
import Contacts from "./contacts/contacts.component";
import Menu from "./menu/menu.component";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../actions/userActions";

function HomePage(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUser(JSON.parse(localStorage.getItem("auth"))));
  }, []);

  return (
    <div className="homePage-container">
      <Menu />
      <Feed />
      <Contacts />
    </div>
  );
}

export default HomePage;
