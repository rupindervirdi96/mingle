import React from "react";
import "./homePage.style.scss";
import Feed from "./feed/feed.component";
import Contacts from "./contacts/contacts.component";
import Menu from "./menu/menu.component";

function HomePage(props) {
  return (
    <div className="homePage-container">
      <Menu />
      <Feed />
      <Contacts />
    </div>
  );
}

export default HomePage;
