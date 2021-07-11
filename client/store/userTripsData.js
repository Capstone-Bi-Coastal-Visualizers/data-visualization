import axios from "axios";

//ACTIONS
const SET_USER_TRIPS_HISTORY = "SET_USER_TRIPS_HISTORY";

//ACTION CREATORS
export const setUserTripsHistory = (userTripsHistory) => ({
  type: SET_USER_TRIPS_HISTORY,
  userTripsHistory,
});


//THUNK CREATORS
export const fetchUserTripsHistory = (token) => async (dispatch) => {
  console.log("here is token", token);
  //console.log('here is window token', window.localStorage.token)
  //token = window.localStorage.token
  //console.log('here is reassigned token', token)
  //if token then axios.get request
  try {
    const { data: user } = await axios.get("/api/trips/", {
      headers: {
        authorization: token,
      },
    });
    console.log("here is userTripHistory", user);
    console.log("here is the dispatch", setUserTripsHistory(user));
    dispatch(setUserTripsHistory(user));
  } catch (error) {
    console.log(error);
  }
};

//REDUCER
export const userTripsReducer = (state = [], action) => {
  switch (action.type) {
    case SET_USER_TRIPS_HISTORY:
      return action.userTripsHistory;
    default:
      return state;
  }
};
