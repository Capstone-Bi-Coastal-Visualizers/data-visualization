import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

const Navbar = ({handleClick, isLoggedIn}) => (
  <div className="navBar">
    <h1>Bon Voyage</h1>
    <div className="dropdown is-active">
  <div className="dropdown-trigger">
    <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
      <span>Dropdown button</span>
      <span className="icon is-small">
        <i className="fas fa-angle-down" aria-hidden="true"></i>
      </span>
    </button>
  </div>
  <div className="dropdown-menu" id="dropdown-menu" role="menu">
    <div className="dropdown-content">
      <a href="#" className="dropdown-item">
        Login
      </a>
      <a className="dropdown-item">
        Sign Up
      </a>
    </div>
  </div>
</div>   
    <nav>
      {isLoggedIn ? (
        <div>
          {/* The navbar will show these links after you log in */}
          <Link to="/home">Home</Link>
          <a href="#" onClick={handleClick}>
            Logout
          </a>
        </div>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.auth.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)
