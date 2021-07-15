import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { logout } from "../store";
import { toggleModal, modalContent } from "../store/auth";

export default function NavBar() {
  const dispatch = useDispatch();
  const [isActive, setisActive] = useState(false);
  const isLoggedIn = useSelector((state) => !!state.auth.user.id);
  const handleClick = () => dispatch(logout());
  const handleToggle = (displayName) => {
    dispatch(toggleModal());
    dispatch(modalContent(displayName));
  };
  const handleNav = (route) => {
    history.push(`/${route}`);
  };
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="image logo-container"></div>
      <div className="navbar-brand">
        <a
          onClick={() => {
            setisActive(!isActive);
          }}
          role="button"
          className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div className="navbar-end">
        <div className="navbar-item">
          <div className="buttons">
            {isLoggedIn ? (
              <div>
                <Link to="/trips">Trips</Link>
                <a href="#" onClick={handleClick}>
                  Logout
                </a>
              </div>
            ) : (
              <div className="navbar-start">
                <a onClick={() => handleToggle("Login")}>
                  <div className="button navbar-item is-primary">Login</div>
                </a>
                <a onClick={() => handleToggle("Signup")}>
                  <div className="button navbar-item is-primary">Sign Up</div>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
