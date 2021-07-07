import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import { Login, Signup } from "./components/AuthForm";
import Home from "./components/Home";
import SearchResult from "./components/SearchResult";
import { me } from "./store";

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { isLoggedIn } = this.props;

    return (
      <div>
        {isLoggedIn ? (
          <Switch>
            <Route path="/home" component={Home} />
            <Redirect to="/home" />
            <Route
              path="/search-result"
              component={SearchResult}
              props={{
                flightOne: 120.51,
                flightTwo: 140.0,
                hotelOne: 120.58,
                hotelTwo: 180,
                budget: 300,
                destinationOne: "Los Angeles",
                destinationTwo: "New York",
              }}
            />
          </Switch>
        ) : (
          <Switch>
            <Route path="/home" component={Home} />
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route
              exact
              path="/search-result"
              render={() => (
                <SearchResult
                  data={{
                    flightOne: 120.51,
                    flightTwo: 140.0,
                    hotelOne: 120.58,
                    hotelTwo: 180,
                    budget: 300,
                    destinationOne: "Los Angeles",
                    destinationTwo: "New York",
                  }}
                />
              )}
            />
          </Switch>
        )}
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me());
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));
