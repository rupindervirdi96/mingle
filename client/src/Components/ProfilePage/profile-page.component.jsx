import React, { useState } from "react";
import "./profile-page.style.scss";
import CreatePost from "../../Components/CreatePost/create-post.component";
import Post from "../Post/post.component";
import Info from "./Info/info.component";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";
import Edit from "../Edit/edit.component";
import FriendsList from "./FriendsList/friendsList.component";
import {
  uploadImage,
  setProfilePic,
  setCoverPic,
} from "../../actions/profileActions";

const ProfilePage = ({ friendsProfile, profile }) => {
  const dispatch = useDispatch();

  const { posts, AnyUser } = useSelector((state) => ({
    posts: state.posts.MyPosts,
    AnyUser: state.posts.UserPosts,
  }));
  const [click, setClick] = useState(false);
  const [click2, setClick2] = useState(false);
  const [click3, setClick3] = useState(false);
  const [click4, setClick4] = useState(false);

  return (
    <div className="profile-container">
      {click ? (
        <Edit
          type="status"
          onChange={(val) => {
            setClick(val);
          }}
        />
      ) : click2 ? (
        <Edit
          type="info"
          onChange={(val) => {
            setClick2(val);
          }}
        />
      ) : click3 ? (
        <Edit
          type="profilePic"
          onChange={(val) => {
            setClick3(val);
          }}
        />
      ) : click4 ? (
        <Edit
          type="coverPic"
          onChange={(val) => {
            setClick4(val);
          }}
        />
      ) : (
        ""
      )}
      <div className="top-section">
        <div className="top-section-content">
          <div
            style={
              friendsProfile == null
                ? { backgroundImage: "url(" + profile.coverPic + ")" }
                : { backgroundImage: "url(" + friendsProfile.coverPic + ")" }
            }
            className="cover"
          >
            {friendsProfile == null ? (
              <div>
                <label htmlFor="editCoverPhoto">
                  <EditIcon color="#fff" className="editCoverPhoto" />
                </label>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="editCoverPhoto"
                  className="editCoverPhoto"
                  onChange={async (e) => {
                    // let url=await dispatch
                    console.log("HELLO");
                    dispatch(
                      setCoverPic(
                        await dispatch(uploadImage(e.target.files[0]))
                      )
                    );
                  }}
                  alt=""
                />
              </div>
            ) : (
              ""
            )}
            <div
              style={
                friendsProfile == null
                  ? { backgroundImage: "url(" + profile.profilePic + ")" }
                  : {
                      backgroundImage: "url(" + friendsProfile.profilePic + ")",
                    }
              }
              className="profile-photo"
            >
              {friendsProfile == null ? (
                <div>
                  <label htmlFor="editProfilePhoto">
                    <EditIcon color="#fff" className="editProfilePhoto" />
                  </label>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    id="editProfilePhoto"
                    className="editProfilePhoto"
                    onChange={async (e) => {
                      // let url=await dispatch
                      dispatch(
                        setProfilePic(
                          await dispatch(uploadImage(e.target.files[0]))
                        )
                      );
                    }}
                    alt=""
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          {friendsProfile == null ? (
            <div className="userDescription">
              <h1>{profile.name}</h1>
              <div>
                {profile.status}{" "}
                <EditIcon
                  className="edit-status editStatus"
                  height="15px"
                  alt=""
                  onClick={() => {
                    setClick(true);
                  }}
                />{" "}
              </div>
            </div>
          ) : (
            <div className="userDescription">
              <h1>{friendsProfile.name}</h1>
              <div>{friendsProfile.status}</div>
            </div>
          )}
          <hr />
          <div className="tabs">
            <ul type="none">
              <li>About</li>
              <li>Friends</li>
              <li>Photos</li>
              <li>Timeline</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="main-section">
        <div className="main-section-content">
          <div className="left">
            <Info
              click={() => {
                setClick2(true);
              }}
            />
            {friendsProfile == null ? <FriendsList /> : ""}
          </div>
          <div className="right">
            {friendsProfile == null ? <CreatePost profile={profile} /> : ""}
            {friendsProfile == null
              ? posts.map((post, key) => {
                  return <Post post={post} key={key} />;
                })
              : AnyUser.map((post, key) => {
                  return <Post post={post} key={key} />;
                })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
