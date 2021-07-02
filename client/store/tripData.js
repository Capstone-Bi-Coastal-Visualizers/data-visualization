import axios from "axios";

//ACTION TYPES
const SET_FLIGHT_DATA = "SET_FLIGHT_DATA";
const SET_HOTEL_DATA = "SET_HOTEL_DATA";

//ACTION CREATORS
const setFlightData = (flightData) => ({
  type: SET_FLIGHT_DATA,
  flightData,
});

const setHotelData = (hotelData) => ({
  type: SET_HOTEL_DATA,
  hotelData,
});

//Thunk Creators
export const fetchFlightData = (searchInput) => async (dispatch) => {
  var options = {
    method: "GET",
    url: "https://travel-advisor.p.rapidapi.com/flights/create-session",
    params: {
      o1: "DMK",
      d1: "CNX",
      dd1: "2021-08-10",
      currency: "USD",
      ta: "1",
      c: "0",
    },
    headers: {
      "x-rapidapi-key": Env_Vars["API_KEY"],
      "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
    },
  };

  const { data } = await axios.request(options);
  console.log(data);
};
// export const fetchFlightData = (searchInput) => async (dispatch) => {
//   console.log("thunk triggered");
//   const headers = {
//     "x-rapidapi-key": "Env_Vars["API_KEY"]",
//     "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
//   };

//   const { originCode, departureCode, departureDate } = searchInput;
//   const params = { o1: originCode, d1: departureCode, dd1: departureDate };
//   try {
//     const { data: flightSession } = await axios.get(
//       "https://travel-advisor.p.rapidapi.com/flights/create-session",
//       params,
//       headers
//     );
//     console.log("this is the flight session", flightSession);
//     // const { data: flightData } = await axios.get();
//     // dispatch(setFlightData(trip));
//   } catch (error) {
//     console.log(error);
//   }
// };

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
const initialState = [];

const tripDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FLIGHT_DATA:
      return [...state, action.flightData];
    case SET_HOTEL_DATA:
      return [...state, action.hotelData];
    default:
      return state;
  }
};

export default tripDataReducer;
