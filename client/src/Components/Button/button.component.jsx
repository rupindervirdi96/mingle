import React from "react";

const Button = ({ name, click }) => {
  const clickHandler = () => {
    switch (name) {
      case "Edit Details":
        click();
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
