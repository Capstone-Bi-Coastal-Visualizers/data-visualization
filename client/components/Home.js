import React from "react";
import { connect } from "react-redux";
import SearchBar from "./SearchBar";

/**
 * COMPONENT
 */
export const Home = (props) => {
  const { email } = props;

  return (
    <div>
      <h3>Welcome, {email}</h3>
      <SearchBar />
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.auth.email,
  };
};

export default connect(mapState)(Home);
