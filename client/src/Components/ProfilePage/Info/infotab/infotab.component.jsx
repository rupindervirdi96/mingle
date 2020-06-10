import React from "react";
import "./infotab.style.scss";

function InfoTab({ type, info }) {
  return (
    <div className="infoTab">
      {type == "work" ? (
        <div>
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yk/r/M0Wls5DHC-A.png"
            height="20px"
            alt=""
          />
          <span>
            Worked at {info.company},{info.location}
          </span>
        </div>
      ) : type == "education" ? (
        <div>
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/id4jdGYPaIP.png"
            height="20px"
            alt=""
          />
          <span>
            Studies at {info.institute} | {info.location}
          </span>
        </div>
      ) : type == "location" ? (
        <div>
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yk/r/X_t0JnueVu-.png"
            height="20px"
            alt=""
          />
          <span>
            Lives in {info.city},{info.country}
          </span>
        </div>
      ) : type == "relation" ? (
        <div>
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yk/r/exk40A1bzjc.png"
            height="20px"
            alt=""
          />
          <span>{info.rel}</span>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default InfoTab;
