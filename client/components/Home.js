import React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import { Login, Signup } from "./AuthForm";
import { toggleModal, modalContent } from "../store/auth";

export const Home = () => {
  const auth = useSelector((state) => state.auth);
  const { showModal, displayName } = auth;

  const num = Math.floor(Math.random() * 7) + 1;

  const dispatch = useDispatch();
  const resetDisplayName = () => {
    dispatch(toggleModal());
    dispatch(modalContent(""));
  };
  return (
    <div className="search-modal-container">
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
      <div className="background-image"
        style={{
          // -moz-background-size: cover
          // -webkit-background-size: cover,
          // -o-background-size: cover,
          // background-size: cover,
          // backgroundSize: "cover",
          // overflow: "hidden",
          // backgroundImage: `url("images/5.png")`,
          backgroundImage: `url("images/${num}.png")`,
        }}
      >
        <SearchBar />
      </div>
    </div>
  );
};

export default Home;
