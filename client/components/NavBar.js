import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store";

export default function NavBar() {
  const dispatch = useDispatch();
  const [isActive, setisActive] = useState(false);
  const isLoggedIn = useSelector((state) => !!state.auth.id);
  const handleClick = () => dispatch(logout());

  return (
    <div className="navBar-container">
      <Link to="/">
        <h1>Bon Voyage</h1>
      </Link>
      <nav className="navbar" role="navigation" aria-label="main navigation">
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
        <div
          id="navbarBasicExample"
          className={`navbar-menu ${isActive ? "is-active" : ""}`}
        >
          {isLoggedIn ? (
            <div className="navbar-start">
              {/* The navbar will show these links after you log in */}
              <Link to="/trips">Trips</Link>
              <a href="#" onClick={handleClick}>
                Logout
              </a>
            </div>
          ) : (
            <div className="navbar-start">
              <Link to="/login">
                <div className="navbar-item">Login</div>
              </Link>
              <Link to="/signup">
                <div className="navbar-item">Sign Up</div>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
