import React from "react";
import "./search.style.scss";
import fblogo from "../../../assets/facebook-clone.png";

const Search = () => {
  return (
    <div className="search-container">
      <img src={fblogo} height="50px" alt="" />
      <span>MiNGLE</span>
    </div>
  );
};

export default Search;
