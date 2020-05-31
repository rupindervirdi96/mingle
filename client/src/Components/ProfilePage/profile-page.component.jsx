import React, { useEffect } from "react";
import "./profile-page.style.scss";
import CreatePost from "../../Components/CreatePost/create-post.component";
import Post from "../Post/post.component";
import Info from "./Info/info.component";
import postImage from "../../assets/profile.png";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../actions/userActions";

const ProfilePage = ({ friendsProfile }) => {
  const { profile } = useSelector((state) => ({
    profile: state.users.profile,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUser(JSON.parse(localStorage.getItem("auth"))));
  }, [dispatch]);

  return (
    <div className="profile-container">
      <div className="top-section">
        <div className="top-section-content">
          <div
            style={{ backgroundImage: "url(" + profile.coverPic + ")" }}
            className="cover"
          >
            <div
              style={{ backgroundImage: "url(" + profile.profilePic + ")" }}
              className="profile-photo"
            ></div>
          </div>
          <div className="userDescription">
            {friendsProfile == null ? (
              <div className="userDescription">
                <h1>{profile.name}</h1>
                <h5>{profile.status}</h5>
              </div>
            ) : (
              <div className="userDescription">
                <h1>{friendsProfile.name}</h1>
                <h5>{friendsProfile.status}</h5>
              </div>
            )}
          </div>
          <hr />
          <div className="tabs">
            <ul type="none">
              <li>Timeline</li>
              <li>About</li>
              <li>Friends</li>
              <li>Photos</li>
            </ul>
            <div></div>
            <ul type="none">
              <li>Edit Profile</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="main-section">
        <div className="main-section-content">
          <div className="left">
            <Info myInfo={profile} friendInfo={friendsProfile} />
          </div>
          <div className="right">
            <CreatePost />
            <Post
              creator={profile.name}
              img={postImage}
              nbLikes="5"
              nbComments="3"
              text="This is the post in my profile"
            />
            <Post
              creator={profile.name}
              img={postImage}
              nbLikes="5"
              nbComments="3"
              text="This is the post in my profile"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
