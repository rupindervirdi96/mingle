import React from "react";
import "./navbar.style.scss";
import Search from "./search/search.component";
import MainTabs from "./mainTabs/main-tabs.component";
import SecondaryTabs from "./secondaryTabs/secondary-tabs.component";
const navbar = ({ profilePic, name }) => {
  // const {profile}
  return (
    <div className="nav-bar">
      <Search />
      <MainTabs name={name} />
      <SecondaryTabs name={name} profilePic={profilePic} />
    </div>
  );
};

export default navbar;
