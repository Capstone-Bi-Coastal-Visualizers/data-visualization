import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import history from "./history";
import store from "./store";
import App from "./App";
import { saveState } from "./localStorage";

// auth,
// tripDataReducer,
// userTripsReducer,
// userTripReducer

store.subscribe(() => {
  saveState({
    tripDataReducer: store.getState().tripDataReducer,
  });
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("app")
);
