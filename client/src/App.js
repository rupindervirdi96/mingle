import React, { useEffect, useState } from "react";
import "./App.scss";
import Login from "./Components/login/login.page";
import Homepage from "./Components/homePage/homePage.component";
import Profile from "./Components/ProfilePage/profile-page.component";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/navbar.component";
import ContactsPage from "./Components/ContactsPage/contacts.page";
import ChatSection from "./Components/ChatSection/chatSection.component";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./actions/userActions";
import { getMyPosts, getAllPostsForFriends } from "./actions/postAction";
import {
  getAllFriends,
  getAllRequests,
  getInfo,
} from "./actions/profileActions";

function App() {
  const { profile } = useSelector((state) => ({
    profile: state.users.profile,
  }));

  const [retrieve, setRetrieve] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    if (profile && !retrieve) {
      dispatch(setUser(JSON.parse(sessionStorage.getItem("auth"))));
      dispatch(getMyPosts());
      dispatch(getAllPostsForFriends());
      dispatch(getAllFriends());
      dispatch(getAllRequests());
      dispatch(getInfo());
      setRetrieve(true);
    }
  }, [profile]);

  return (
    <div className="App">
      <Router>
        <Route exact path="/">
          <Login />
        </Route>
        <Navbar />
        <Route exact path="/home">
          <Homepage />
          <ChatSection profile={profile} />
        </Route>
        <Route exact path="/profile">
          <Profile profile={profile} />
        </Route>
        <Route exact path="/friends">
          <ContactsPage profile={profile} />
        </Route>
      </Router>
    </div>
  );
}

export default App;
