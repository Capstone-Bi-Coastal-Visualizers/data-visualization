import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { authenticate, authenticateSignup } from "../store";
import { toggleModal } from "../store/auth";

/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const dispatch = useDispatch();
  const { name, displayName, handleSubmit, error } = props;

  return (
    <div className="box field">
      {/* <form onSubmit={handleSubmit} name={name}> */}
      {/* <label className="label" htmlFor="email">
              <small>Email</small>
          </label>
          <input name="email" type="text" /> */}
      <div class="field">
        <label class="label has-text-centered">E-Mail</label>
        <div class="control">
          <input class="email" type="text" placeholder="E-Mail" />
        </div>
      </div>
      <div class="field">
        <label class="label has-text-centered">Password</label>
        <div class="control">
          <input class="password" type="text" placeholder="Password" />
        </div>
      </div>
      {/* <div>
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input name="password" type="password" />
        </div> */}
      {displayName === "Sign Up" && (
        <div>
          <div>
            <label htmlFor="firstName">
              <small>First Name</small>
            </label>
            <input name="firstName" type="text" />
          </div>
          <div>
            <label htmlFor="lastName">
              <small>Last Name</small>
            </label>
            <input name="lastName" type="text" />
          </div>{" "}
        </div>
      )}
      <div>
        <button type="submit" onClick={() => dispatch(toggleModal())}>
          {displayName}
        </button>
      </div>
      {error && error.response && <div> {error.response.data} </div>}
      {/* </form> */}
    </div>
  );
};

const mapLogin = (state) => {
  return {
    name: "login",
    displayName: "Login",
    error: state.auth.error,
  };
};

const mapSignup = (state) => {
  return {
    name: "signup",
    displayName: "Sign Up",
    error: state.auth.error,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(evt) {
      evt.preventDefault();
      const formName = evt.target.name;
      const email = evt.target.email.value;
      const password = evt.target.password.value;
      if (formName === "login") {
        dispatch(authenticate(email, password, formName));
      } else {
        const firstName = evt.target.firstName.value;
        const lastName = evt.target.lastName.value;
        dispatch(
          authenticateSignup(email, password, firstName, lastName, formName)
        );
      }
    },
  };
};

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);
