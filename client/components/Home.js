import React from "react";
import { connect, useDispatch } from "react-redux";
import SearchBar from "./SearchBar";
import { Login, Signup } from "./AuthForm";
import { toggleModal, modalContent } from "../store/auth";

/**
 * COMPONENT
 */

export const Home = (props) => {
  const dispatch = useDispatch();
  const resetDisplayName = () => {
    dispatch(toggleModal());
    dispatch(modalContent(""));
  };
  const { firstName, lastName, showModal, displayName } = props;
  return (
    <div className="search-container">
      <div className={`modal ${showModal ? "is-active" : ""}`}>
        <div className="modal-background"></div>
        <div className="modal-content">
          {displayName === "Login" ? <Login /> : <Signup />}
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={resetDisplayName}
        ></button>
      </div>
      <SearchBar />
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.auth.user.email,
    firstName: state.auth.user.firstName,
    lastName: state.auth.user.lastName,
    showModal: state.auth.showModal,
    displayName: state.auth.displayName,
  };
};

export default connect(mapState)(Home);
