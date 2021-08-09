import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Login, Signup } from "./AuthForm";
import { toggleModal, modalContent } from "../store/auth";

const Modal = () => {
  const auth = useSelector((state) => state.auth);
  const { showModal, displayName } = auth;
  const dispatch = useDispatch()
  const resetDisplayName = () => {
    dispatch(toggleModal());
    dispatch(modalContent(""));
  };
  return (
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
  );
};

export default Modal;
