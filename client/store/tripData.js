import axios from "axios";

//ACTION TYPES
const SET_TRIP_ONE_FIRST_FLIGHT = "SET_TRIP_ONE_FIRST_FLIGHT";
const SET_TRIP_ONE_RETURNING_FLIGHT = "SET_TRIP_ONE_RETURNING_FLIGHT";
const SET_TRIP_ONE_HOTEL_DATA = "SET_TRIP_ONE_HOTEL_DATA";
const SET_TRIP_ONE_STAY_DURATION = "SET_TRIP_ONE_STAY_DURATION";

const SET_TRIP_TWO_FIRST_FLIGHT = "SET_TRIP_TWO_FIRST_FLIGHT";
const SET_TRIP_TWO_RETURNING_FLIGHT = "SET_TRIP_TWO_RETURNING_FLIGHT";
const SET_TRIP_TWO_HOTEL_DATA = "SET_TRIP_TWO_HOTEL_DATA";
const SET_TRIP_TWO_STAY_DURATION = "SET_TRIP_TWO_STAY_DURATION";

const SET_BUDGET = "SET_BUDGET";
const SET_TRIP = "SET_TRIP";
const SET_ERROR = "SET_ERROR"

//ACTION CREATORS
const setTripOneFirstFlight = (flightData) => ({
  type: SET_TRIP_ONE_FIRST_FLIGHT,
  flightData,
});

const setTripOneReturningFlight = (flightData) => ({
  type: SET_TRIP_ONE_RETURNING_FLIGHT,
  flightData,
});

const setTripOneHotelData = (hotelData) => ({
  type: SET_TRIP_ONE_HOTEL_DATA,
  hotelData,
});

const setTripTwoFirstFlight = (flightData) => ({
  type: SET_TRIP_TWO_FIRST_FLIGHT,
  flightData,
});

const setTripTwoReturningFlight = (flightData) => ({
  type: SET_TRIP_TWO_RETURNING_FLIGHT,
  flightData,
});

const setTripTwoHotelData = (hotelData) => ({
  type: SET_TRIP_TWO_HOTEL_DATA,
  hotelData,
});

export const setBudget = (budget) => ({
  type: SET_BUDGET,
  budget,
});

export const setTripOneStayDuration = (stayDuration) => ({
  type: SET_TRIP_ONE_STAY_DURATION,
  stayDuration,
});

export const setTripTwoStayDuration = (stayDuration) => ({
  type: SET_TRIP_TWO_STAY_DURATION,
  stayDuration,
});

export const setTrip = (tripNumber) => ({
  type: SET_TRIP,
  tripNumber,
});

export const setError = (boolean) => ({
  type: SET_ERROR,
  boolean
})

//Thunk Creators
export const fetchFlightSession =
  (searchInput, returningFlight, tripNumber) => async (dispatch) => {
    try {
      let { origin, destination, departureDate, returnDate } = searchInput;
      let flightDate;

      if (returningFlight) {
        let prevOrigin = origin;
        origin = destination;
        destination = prevOrigin;
        flightDate = returnDate;
      } else {
        flightDate = departureDate;
      }
      const travelDataParams = {
        origin,
        destination,
        flightDate,
      };
      const { data: bestFlight } = await axios.get(`/api/travelData/flight`, {
        params: travelDataParams,
      });
      dispatch(setError(false))
      if (tripNumber === 1) {
        if (returningFlight === false) {
          dispatch(setTripOneFirstFlight(bestFlight));
        } else {
          dispatch(setTripOneReturningFlight(bestFlight));
        }
      } else {
        if (returningFlight === false) {
          dispatch(setTripTwoFirstFlight(bestFlight));
        } else {
          dispatch(setTripTwoReturningFlight(bestFlight));
        }
      }
    } catch (error) {
      dispatch(setError(true))
      console.error(error);
    }
  };

export const fetchHotelData =
  (airportCoordinates, departureDate, tripNumber) => async (dispatch) => {
    try {
      const [lon, lat] = airportCoordinates;
      const hotelParams = {
        lon,
        lat,
        departureDate,
      };
      const { data: bestHotel } = await axios.get(`api/travelData/hotel`, {
        params: hotelParams,
      });
      dispatch(setError(false))
      if (tripNumber === 1) {
        dispatch(setTripOneHotelData(bestHotel));
      } else {
        dispatch(setTripTwoHotelData(bestHotel));
      }
    } catch (error) {
      dispatch(setError(true))
      console.error(error);
    }
  };

//reducer
const initialState = { error: false };

export const tripDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TRIP_ONE_FIRST_FLIGHT:
      return { ...state, tripOneFirstFlight: action.flightData };
    case SET_TRIP_ONE_RETURNING_FLIGHT:
      return { ...state, tripOneReturningFlight: action.flightData };
    case SET_TRIP_ONE_HOTEL_DATA:
      return { ...state, tripOneHotelData: action.hotelData };
    case SET_TRIP_TWO_FIRST_FLIGHT:
      return { ...state, tripTwoFirstFlight: action.flightData };
    case SET_TRIP_TWO_RETURNING_FLIGHT:
      return { ...state, tripTwoReturningFlight: action.flightData };
    case SET_TRIP_TWO_HOTEL_DATA:
      return { ...state, tripTwoHotelData: action.hotelData };
    case SET_BUDGET:
      return { ...state, budget: action.budget };
    case SET_TRIP_ONE_STAY_DURATION:
      return { ...state, tripOneStayDuration: action.stayDuration };
    case SET_TRIP_TWO_STAY_DURATION:
      return { ...state, tripTwoStayDuration: action.stayDuration };
    case SET_TRIP:
      return { ...state, selectedTrip: action.tripNumber };
    case SET_ERROR:
      return { ...state, error: action.boolean };
    default:
      return state;
  }
};
