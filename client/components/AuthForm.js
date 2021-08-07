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
  const [state, setState] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    name: name,
  });

  return (
    <div className="box box-login field is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
      <div className="field">
        <label className="label has-text-centered" htmlFor="email">
          E-Mail
        </label>
        <div className="control">
          <input
            className="input"
            name="email"
            type="email"
            value={state.email}
            onChange={(event) => {
              setState({ ...state, email: event.target.value });
            }}
            placeholder="E-Mail"
          />
        </div>
      </div>
      <div className="field">
        <label className="label has-text-centered" htmlFor="password">
          Password
        </label>
        <div className="control">
          <input
            className="input"
            name="password"
            type="password"
            value={state.password}
            onChange={(event) => {
              setState({ ...state, password: event.target.value });
            }}
            placeholder="Password"
          />
        </div>
      </div>

      {displayName === "Sign Up" && (
        <>
          <div className="field">
            <label className="label has-text-centered" htmlFor="firstName">
              First Name
            </label>
            <div className="control">
              <input
                className="input"
                name="firstName"
                type="text"
                onChange={(event) => {
                  setState({ ...state, firstName: event.target.value });
                }}
                value={state.firstName}
                placeholder="First Name"
              />
            </div>
          </div>
          <div className="field">
            <label className="label has-text-centered" htmlFor="lastName">
              Last Name
            </label>
            <div className="control">
              <input
                className="input"
                name="lastName"
                type="text"
                onChange={(event) => {
                  setState({ ...state, lastName: event.target.value });
                }}
                value={state.lastName}
                placeholder="Last Name"
              />
            </div>
          </div>
        </>
      )}
      <div className="control">
        <button
          type="submit"
          className="button is-primary"
          onClick={() => {
            handleSubmit(state);
            dispatch(toggleModal());
          }}
        >
          {displayName}
        </button>
      </div>
      {error && error.response && <div> {error.response.data} </div>}
      {displayName === "Login" ? (
        <button
          className="button is-primary mt-2"
          onClick={() => {
            setState({
              email: "cody@gmail.com",
              password: "123",
              name: "login",
            });
          }}
        >
          Demo Login
        </button>
      ) : (
        <></>
      )}
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
    handleSubmit(state) {
      const formName = state.name;
      const email = state.email;
      const password = state.password;
      if (formName === "login") {
        dispatch(authenticate(email, password, formName));
      } else {
        const firstName = state.firstName;
        const lastName = state.lastName;
        dispatch(
          authenticateSignup(email, password, firstName, lastName, formName)
        );
      }
    },
  };
};

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);
