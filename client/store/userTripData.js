import axios from "axios";

//ACTIONS
const SET_USER_TRIP_DETAIL = "SET_USER_TRIP_DETAIL";

//ACTION CREATORS
export const setUserTripDetail = (userTripDetail) => ({
    type: SET_USER_TRIP_DETAIL,
    userTripDetail,
  });

//THUNK CREATORS
export const fetchUserTripDetail = (token, id) => async (dispatch) => {
    console.log("here is token", token);
    try {
      const { data: trip } = await axios.get(`/api/trips/${id}`, {
        headers: {
          authorization: token,
        },
      });
      console.log("here is userTripDetail", trip);
      console.log("here is the dispatch", setUserTripDetail(trip));
      dispatch(setUserTripDetail(trip));
    } catch (error) {
      console.log(error);
    }
  };

//REDUCER
export const userTripReducer = (state = [], action) => {
    switch (action.type) {
      case SET_USER_TRIP_DETAIL:
        return action.userTripDetail;
      default:
        return state;
    }
  };