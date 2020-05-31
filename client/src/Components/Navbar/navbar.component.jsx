import React, { useEffect } from "react";
import "./navbar.style.scss";
import Search from "./search/search.component";
import MainTabs from "./mainTabs/main-tabs.component";
import SecondaryTabs from "./secondaryTabs/secondary-tabs.component";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../actions/userActions";

const Navbar = () => {
  const { profile } = useSelector((state) => ({
    profile: state.users.profile,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUser(JSON.parse(localStorage.getItem("auth"))));
  }, [dispatch]);

  return (
    <div className="nav-bar">
      <Search />
      <MainTabs />
      <SecondaryTabs name={profile.name} />
    </div>
  );
};

export default Navbar;
