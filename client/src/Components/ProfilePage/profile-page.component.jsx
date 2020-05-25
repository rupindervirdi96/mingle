import React, { useEffect } from "react";
import "./profile-page.style.scss";
import CreatePost from "../../Components/CreatePost/create-post.component";
import "./profile-page.style.scss";
import Post from "../Post/post.component";
import Info from "./Info/info.component";
import postImage from "../../assets/profile.png";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../actions/userActions";

const ProfilePage = () => {
  const { profile } = useSelector((state) => ({
    profile: state.users.profile,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUser(JSON.parse(localStorage.getItem("auth"))));
  }, []);

  return (
    <div className="profile-container">
      <div className="top-section">
        <div className="top-section-content">
          <div className="cover">
            <div className="profile-photo"></div>
          </div>
          <div className="userDescription">
            <h1>{profile.name}</h1>
            <h5>{profile.status}</h5>
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
            <Info />
          </div>
          <div className="right">
            <CreatePost name="Rupinder" />
            <Post
              creator={profile.name}
              img={postImage}
              nbLikes="5"
              nbComments="3"
              text="This is the post in my profile"
            />
            <Post creator="Rupinder" text="This is 2nd post in my profile" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
