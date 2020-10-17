import React from "react";

function Friend({ prof }) {
  return (
    <div className="friend">
      <div
        className="photo"
        style={{
          backgroundImage: `url(${prof.photo})`,
        }}
      ></div>
      <span
        className="name"
        style={{ fontSize: "16px", textAlign: "center", width: "100%" }}
      >
        {prof.name.split(" ")[0]}
      </span>
    </div>
  );
}

export default Friend;
