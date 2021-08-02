import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { logout } from "../store";
import { toggleModal, modalContent } from "../store/auth";

export default function NavBar() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isActive, setisActive] = useState(false);
  const isLoggedIn = useSelector((state) => !!state.auth.user.id);
  const handleClick = () => dispatch(logout());
  const handleToggle = (displayName) => {
    dispatch(toggleModal());
    dispatch(modalContent(displayName));
  };
  const handleNav = (route) => {
    history.push(route);
  };
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="container-logo">
        <img src="images/logo1.png"
        onClick={() => {
          handleNav("/");
        }}/>
      </div>
      <div className="navbar-end">
        <div className="navbar-button-container">
          {isLoggedIn ? (
            <div className="button-container">
              <a
                className="button is-primary"
                onClick={() => {
                  handleNav("/trips");
                }}
              >
                Trips
              </a>
              <a className="button is-primary" href="#" onClick={handleClick}>
                Logout
              </a>
            </div>
          ) : (
            <div className="button-container">
              <a onClick={() => handleToggle("Login")}>
                <div className="button is-primary">Login</div>
              </a>
              <a onClick={() => handleToggle("Signup")}>
                <div className="button is-primary">Sign Up</div>
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
