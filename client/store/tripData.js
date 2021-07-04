import axios from "axios";

//ACTION TYPES
const SET_FIRST_FLIGHT = "SET_FIRST_FLIGHT";
const SET_RETURNING_FLIGHT = "SET_RETURNING_FLIGHT";
const SET_HOTEL_DATA = "SET_HOTEL_DATA";

//ACTION CREATORS
const setFirstFlight = (flightData) => ({
  type: SET_FIRST_FLIGHT,
  flightData,
});

const setReturningFlight = (flightData) => ({
  type: SET_RETURNING_FLIGHT,
  flightData,
});

const setHotelData = (hotelData) => ({
  type: SET_HOTEL_DATA,
  hotelData,
});

//Thunk Creators
export const fetchFlightSession = (searchInput) => async (dispatch) => {
  //Test 7/12 JFK to LAX and consistent 0
  //Create session and retreive SID
  try {
    const { origin, destination, flightDate, returningFlight } = searchInput;
    const sessionConfig = {
      headers: {
        "x-rapidapi-key": Env_Vars["API_KEY"],
        "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
      },
      params: {
        o1: origin,
        d1: destination,
        dd1: flightDate,
        currency: "USD",
        ta: "1",
        c: "0",
      },
    };
    const { data: flightSession } = await axios.get(
      "https://travel-advisor.p.rapidapi.com/flights/create-session",
      sessionConfig
    );
    const pollSID = flightSession.search_params.sid;
    dispatch(fetchFlightData(pollSID, returningFlight));
  } catch (error) {
    console.error(error);
  }
};

export const fetchFlightData = (sid, returningFlight) => async (dispatch) => {
  try {
    console.log(sid);
    const pollConfig = {
      params: {
        sid: sid,
        so: "PRICE",
        currency: "USD",
        n: "15",
        ns: "NON_STOP,ONE_STOP",
        o: "0",
      },
      headers: {
        "x-rapidapi-key": Env_Vars["API_KEY"],
        "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
      },
    };

    const { data: flightData } = await axios.get(
      "https://travel-advisor.p.rapidapi.com/flights/poll",
      pollConfig
    );
    const flightItineraries = flightData.itineraries;
    console.log(flightData);
    console.log(flightItineraries);
    let bestFlight = {};
    let minPrice = 9999;

    for (let i = 0; i < flightItineraries.length; i++) {
      let currPrice = flightItineraries[i].l[0].pr.p;
      if (currPrice > 1 && currPrice < minPrice) {
        minPrice = currPrice;
        bestFlight = flightItineraries[i];
      }
    }

    console.log(bestFlight);
    if (returningFlight === false) {
      dispatch(setFirstFlight(bestFlight));
    } else {
      dispatch(setReturningFlight(bestFlight));
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchHotelData = (airportCoordinates) => async (dispatch) => {
  const { longitude, latitude } = airportCoordinates;
  try {
    const { data: hotelData } = await axios.get();
    dispatch(setHotelData(trip));
  } catch (error) {
    next(error);
  }
};

//reducer
const initialState = {};

const tripDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FIRST_FLIGHT:
      return { ...state, firstFlight: action.flightData };
    case SET_RETURNING_FLIGHT:
      return { ...state, returningFlight: action.flightData };
    case SET_HOTEL_DATA:
      return { ...state, hotelData: action.hotelData };
    default:
      return state;
  }
};

export default tripDataReducer;
