import React, { useEffect } from "react";
import "./homePage.style.scss";
import Feed from "./feed/feed.component";
import Contacts from "./contacts/contactList.component";
import Menu from "./menu/menu.component";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../actions/userActions";

function HomePage({ profile }) {
  return (
    <div className="homePage-container">
      <Menu />
      <Feed />
      <Contacts />
    </div>
  );
}

export default HomePage;
