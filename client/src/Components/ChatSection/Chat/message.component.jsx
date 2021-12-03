import React from "react";

const Message = ({ align, text }) => {
  return align === "left" ? (
    <div className="message left">
      <h4>{text}</h4>
    </div>
  ) : (
    <div className="message right">
      <h4>{text}</h4>
    </div>
  );
};

export default Message;
