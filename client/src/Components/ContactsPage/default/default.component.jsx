import React from "react";
import peopleIcon from "../../../svg/people.svg";

const Default = () => {
  return (
    <div className="default">
      <img height="80px" src={peopleIcon} alt="" />
      <h4>Select people's name to view profile</h4>
    </div>
  );
};

export default Default;
