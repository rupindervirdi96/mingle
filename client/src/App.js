import React, { useState, useEffect } from "react";
import "./App.scss";
import Login from "./Components/login/login.page"
import Homepage from "./Components/homePage/homePage.component";
import Profile from "./Components/ProfilePage/profile-page.component";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/navbar.component";
import profilePic from "./assets/profile.png";
import Axios from "axios";
import { Provider } from "react-redux";
import store from "./store";
import ChatSection from "./Components/ChatSection/chatSection.component";


function App() {
  // const [user, setUser] = useState();

  // useEffect(() => {
  //   Axios.get("http://localhost:5000/user/login").then(response => {
  //     setUser(response.data)
  //   }).catch(error => console.log(error)
  //   )
  // })



  return (
    <Provider store={store}>

      <div className="App">
        <Router>
          <Route exact path="/">
            <Login />
          </Route>
          <Navbar profilePic={profilePic} name={"Rupinder"} />
          <Route exact path="/home">
            <Homepage />
            <ChatSection />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
        </Router>
      </div>
    </Provider>
  )
}

export default App;

