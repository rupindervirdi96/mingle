import React, { useState, useEffect } from "react";
import "./edit.style.scss";
import { useDispatch } from "react-redux";
import { changeStatus } from "../../actions/userActions";
import { setProfilePic, setCoverPic } from "../../actions/profileActions";
// import more from "../../assets/more.png";
import axios from "axios";

function Edit({ onChange, type }) {
  const [click, setClick] = useState(false);
  const [status, setStatus] = useState("");
  const [prof, setProfile] = useState("");
  const [cover, setCover] = useState("");

  const dispatch = useDispatch();

  const updateState = (e) => {
    setStatus(e.target.value);
  };

  //Profile Pic
  const updateProfilePic = (e) => {
    setProfile(e.target.value);
  };

  const saveProfilePic = () => {
    // alert(prof);
    dispatch(setProfilePic(prof));
    window.location.reload();
  };

  //Cover Pic
  const updateCoverPic = (e) => {
    setCover(e.target.value);
  };

  const saveCoverPic = () => {
    dispatch(setCoverPic(cover));
    window.location.reload();
  };

  const saveStatus = () => {
    dispatch(changeStatus(status));
    window.location.reload();
  };

  //work
  const [workPosition, setworkPosition] = useState("");
  const [workCompany, setworkCompany] = useState("");
  const [workLocation, setworkLocation] = useState("");
  const [workStartDate, setworkStartDate] = useState("");
  const [workEndDate, setworkEndDate] = useState("");

  //education
  const [educationCourse, setEducationCourse] = useState("");
  const [educationInstitute, setEducationInstitute] = useState("");
  const [educationLocation, setEducationLocation] = useState("");
  const [educationStartDate, setEducationStartDate] = useState("");
  const [educationEndDate, setEducationEndDate] = useState("");

  //location
  const [locationCity, setLocationCity] = useState();
  const [locationCountry, setLocationCountry] = useState();

  const updateRelationship = async (e) => {
    e.preventDefault();
    const tag = document.querySelector(".relOpt");
    const value = tag.options[tag.selectedIndex].value;
    const data = {
      rel: value,
      type: "relation",
    };
    axios.defaults.headers.common["x-auth-token"] = JSON.parse(
      sessionStorage.getItem("auth")
    );

    const res = await axios.post("/profile/info/change", data);
  };
  const updateWork = async (e) => {
    e.preventDefault();
    const data = {
      position: workPosition,
      company: workCompany,
      location: workLocation,
      start: workStartDate,
      end: workEndDate,
      type: "work",
    };
    axios.defaults.headers.common["x-auth-token"] = JSON.parse(
      sessionStorage.getItem("auth")
    );

    const res = await axios.post("/profile/info/change", data);
  };
  const updateEducation = async (e) => {
    e.preventDefault();
    const data = {
      course: educationCourse,
      institute: educationInstitute,
      location: educationLocation,
      start: educationStartDate,
      end: educationEndDate,
      type: "education",
    };
    axios.defaults.headers.common["x-auth-token"] = JSON.parse(
      sessionStorage.getItem("auth")
    );

    const res = await axios.post("/profile/info/change", data);
  };
  const updateLocation = async (e) => {
    e.preventDefault();
    const data = {
      city: locationCity,
      country: locationCountry,
      type: "location",
    };
    axios.defaults.headers.common["x-auth-token"] = JSON.parse(
      sessionStorage.getItem("auth")
    );

    const res = await axios.post("/profile/info/change", data);
  };

  return (
    <div className="EditContainer">
      <div
        className="screen"
        onClick={() => (click == false ? onChange(false) : onChange(true))}
      ></div>
      {type == "status" ? (
        <div className="editStatus">
          <h2>Update Status</h2>
          <input
            onChange={updateState}
            type="text"
            placeholder="Enter new Status"
          />
          <button className="btnUpdate" onClick={saveStatus}>
            UPDATE
          </button>
        </div>
      ) : type == "info" ? (
        <div className="editInfo">
          <h1>Edit Info</h1>
          <h4>Add Work</h4>
          <div className="work-info">
            <div className="work-module">
              <form onSubmit={updateWork}>
                <input
                  type="text"
                  onChange={(e) => {
                    setworkPosition(e.target.value);
                  }}
                  placeholder="Position"
                  required
                />
                <input
                  type="text"
                  onChange={(e) => {
                    setworkCompany(e.target.value);
                  }}
                  placeholder="Company"
                  required
                />
                <input
                  type="text"
                  onChange={(e) => {
                    setworkLocation(e.target.value);
                  }}
                  placeholder="Location"
                  required
                />
                <input
                  type="date"
                  onChange={(e) => {
                    setworkStartDate(e.target.value);
                  }}
                  placeholder="from"
                  required
                />
                <input
                  type="date"
                  onChange={(e) => {
                    setworkEndDate(e.target.value);
                  }}
                  placeholder="to"
                  required
                />
                <button className="btnAdd">ADD</button>
              </form>
            </div>
          </div>
          <h4>Add Education</h4>
          <div className="school-info">
            <div className="education-module">
              <form action="" onSubmit={updateEducation}>
                <input
                  type="text"
                  onChange={(e) => {
                    setEducationCourse(e.target.value);
                  }}
                  placeholder="Course"
                  required
                />
                <input
                  type="text"
                  onChange={(e) => {
                    setEducationInstitute(e.target.value);
                  }}
                  placeholder="Institute"
                  required
                />
                <input
                  type="text"
                  onChange={(e) => {
                    setEducationLocation(e.target.value);
                  }}
                  placeholder="location"
                  required
                />
                <input
                  type="date"
                  onChange={(e) => {
                    setEducationStartDate(e.target.value);
                  }}
                  placeholder="from"
                  required
                />
                <input
                  type="date"
                  onChange={(e) => setEducationEndDate(e.target.value)}
                  placeholder="to"
                  required
                />
                <button className="btnAdd">ADD</button>
              </form>
            </div>
          </div>
          <h4>Add Location</h4>
          <div className="location-info">
            <form action="" onSubmit={updateLocation}>
              <input
                type="text"
                onChange={(e) => {
                  setLocationCity(e.target.value);
                }}
                placeholder="City"
                required
              />
              <input
                type="text"
                onChange={(e) => {
                  setLocationCountry(e.target.value);
                }}
                placeholder="Country"
                required
              />
              <button className="btnAdd">ADD</button>
            </form>
          </div>
          <h4>Relation-ship Status</h4>
          <div className="relationship-info">
            <form action="" onSubmit={updateRelationship}>
              <select name="relationship" className="relOpt">
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
              <button className="btnAdd">UPDATE</button>
            </form>
          </div>

          <button
            className="btnUpdate"
            onClick={() => {
              click == false ? onChange(false) : onChange(true);
              window.location.reload();
            }}
          >
            FINISH
          </button>
        </div>
      ) : type == "profilePic" ? (
        <div className="editProfilePhoto">
          <h2>Update Profile Photo</h2>
          <input
            onChange={updateProfilePic}
            type="text"
            onLoad={(e) => {
              e.focus();
            }}
            placeholder="Enter the url"
          />
          <button className="btnUpdate" onClick={saveProfilePic}>
            UPDATE
          </button>
        </div>
      ) : type == "coverPic" ? (
        <div className="editProfilePhoto">
          <h2>Update Cover Photo</h2>
          <input
            onChange={updateCoverPic}
            type="text"
            placeholder="Enter the url"
          />
          <button className="btnUpdate" onClick={saveCoverPic}>
            UPDATE
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Edit;
