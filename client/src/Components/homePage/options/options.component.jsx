import React from "react";
import { useDispatch } from "react-redux";

function Options() {
  const logout = () => {
    sessionStorage.removeItem("auth");
    window.location = "/";
  };

  return (
    <div className="optionss">
      <h1>Settings</h1>
      <ul type="none">
        <li onClick={logout}>LOGOUT</li>
        {/* <li>DELETE ACCOUNT</li> */}
      </ul>
    </div>
  );
}

export default Options;
