import React from "react";
import "./search.style.scss";
import fblogo from "../../../assets/facebook.png";
import searchIcon from "../../../assets/search.png";

const Search = () => {
  return (
    <div className="search-container">
      <img src={fblogo} height="50px" alt="" />
      <div className="search-textBox">
        <img src={searchIcon} height="18px" alt="" />
        <input type="text" placeholder="Search facebook-clone" />
      </div>
    </div>
  );
};

export default Search;
