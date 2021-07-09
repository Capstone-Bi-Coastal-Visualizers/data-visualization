import axios from "axios";

const SET_USER_TRIPS_HISTORY = "SET_USER_TRIPS_HISTORY";

//ACTION CREATORS
export const setUserTripsHistory = (userTripHistory) => ({
    type: SET_USER_TRIPS_HISTORY,
    userTripHistory
  });

//Thunk Creators
export const fetchUserTripHistory = (token) => async (dispatch) => {
    // console.log('here is token', token)
    //window.localstorage.key
    //if token then axios.get request
    try {
      const { data: user } = await axios.get("/trips", {
        headers: {
          authorization: token
        }
      });
      console.log('here is userTripHistory', user)
      console.log('here is the dispatch', setUserTripsHistory(user))
      dispatch(setUserTripsHistory(user))
    } catch (error) {
      console.log(error)
    }
  } 

  //reducer

  export const userTripReducer = (state = [], action) => {
    switch (action.type) {
      case SET_USER_TRIPS_HISTORY:
        return action.userTripHistory;
      default:
        return state;
    }
  }