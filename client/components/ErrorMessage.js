import React from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";

const ErrorMessage = (props) => {
  const message = props.message;
  return (
    <div className="container navigate-home-container">
      <h2>{message}</h2>
      <Link to="/" className="button is-primary mt-3">
        Return
      </Link>
      <Modal />
    </div>
  );
};

export default ErrorMessage;
