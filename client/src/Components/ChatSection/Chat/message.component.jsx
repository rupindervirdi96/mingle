import React from "react";

const Message = ({ align, text }) => {
  return (
    <div className={`message ${align}`}>
      <span>{text}</span>
    </div>
  );
};

export default Message;
