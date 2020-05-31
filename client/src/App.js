import React from "react";
import "./App.scss";
import Login from "./Components/login/login.page"
import Homepage from "./Components/homePage/homePage.component";
import Profile from "./Components/ProfilePage/profile-page.component";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/navbar.component";
import Friends from "./Components/ContactsPage/contacts.page"

import { Provider } from "react-redux";
import store from "./store";
import ChatSection from "./Components/ChatSection/chatSection.component";


function App() {

  return (
    <Provider store={store}>

      <div className="App">
        <Router>
          <Route exact path="/">
            <Login />
          </Route>
          <Navbar />
          <Route exact path="/home">
            <Homepage />
            <ChatSection />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/friends">
            <Friends />
          </Route>
        </Router>
      </div>
    </Provider>
  )
}

export default App;

