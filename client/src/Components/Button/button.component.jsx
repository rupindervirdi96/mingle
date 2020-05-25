import React from "react";

const Button = ({ name }) => {
  const clickHandler = () => {
    switch (name) {
      case "value":

        break;
      default:
          
        break;
    }
  };
  return (
    <div className="button">
      <button onClick={clickHandler}>{name}</button>
    </div>
  );
};

export default Button;
