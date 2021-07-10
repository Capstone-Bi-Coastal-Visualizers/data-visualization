import React from "react";
import { connect } from "react-redux";
import SearchBar from "./SearchBar";

/**
 * COMPONENT
 */
export const Home = (props) => {
  const { firstName, lastName } = props;

  return (
    <div>
      <h3>
        Welcome {firstName} {lastName}
      </h3>
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
    firstName: state.auth.firstName,
    lastName: state.auth.lastName,
  };
};

export default connect(mapState)(Home);
