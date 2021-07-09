const SET_USER_TRIPS_HISTORY = "SET_USER_TRIPS_HISTORY";

//ACTION CREATORS
export const setUserTripsHistory = (userTripHistory) => ({
    type: SET_USER_TRIPS_HISTORY,
    userTripHistory
  });

//Thunk Creators
export const fetchUserTripHistory = (token) => async (dispatch) => {
    try {
      const { data: userTripHistory } = await axios.get("/auth/me", {
        headers: {
          authorization: token
        }
      });
      dispatch(setUserTripsHistory(userTripHistory))
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