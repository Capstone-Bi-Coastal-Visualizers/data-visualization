import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {Link} from 'react-router-dom';

export default function NavBarTwo() {
    // const [state, setState] = useState({
    //     menuToggle: false
    // })

    const [isActive, setisActive] = React.useState(false);

  return (

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
          <div className="navbar-start">
          <Link to="/login">
            <div className="navbar-item">Login</div>
          </Link>
          <Link to="/signup">
            <div className="navbar-item">Sign Up</div>
            </Link>
          </div>
        </div>
   </nav>
  )
}