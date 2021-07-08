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

const SET_USER_TRIPS_HISTORY = "SET_USER_TRIPS_HISTORY";
const SET_TRIP = "SET_TRIP";

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

export const setUserTripsHistory = (userTripHistory) => ({
  type: SET_USER_TRIPS_HISTORY,
  userTripHistory
});

export const setTrip = (tripNumber) => ({
  type: SET_TRIP,
  tripNumber,
});

//Thunk Creators
export const fetchFlightSession = (searchInput) => async (dispatch) => {
  try {
    const { origin, destination, flightDate, returningFlight, tripNumber } =
      searchInput;
    const sessionConfig = {
      headers: {
        "x-rapidapi-key": Env_Vars["FLIGHT_API_KEY"],
        "x-rapidapi-host":
          "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      },
    };
    const { data: flightSession } = await axios.get(
      `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${origin}/${destination}/${flightDate}`,
      sessionConfig
    );
    const bestFlight = [
      flightSession.Carriers[0],
      flightSession.Quotes[0],
      flightSession.Places,
    ];

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
    console.error(error);
  }
};

export const fetchHotelData =
  (airportCoordinates, departureDate, tripNumber) => async (dispatch) => {
    const { longitude, latitude } = airportCoordinates;
    try {
      var options = {
        params: {
          latitude,
          longitude,
          lang: "en_US",
          hotel_class: "1,2,3",
          limit: "30",
          adults: "1",
          // amenities: 'beach,bar_lounge,airport_transportation',
          rooms: "1",
          currency: "USD",
          checkin: departureDate,
          nights: "4",
        },
        headers: {
          "x-rapidapi-key": Env_Vars["HOTEL_API_KEY"],
          "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
        },
      };
      const { data: hotelData } = await axios.get(
        "https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng",
        options
      );
      let minPrice = 9999;
      let bestHotel = {};
      hotelData.data.forEach((hotel) => {
        if (hotel.price) {
          let currPrice = Number(hotel.price.split(" ")[0].split("$")[1]);
          if (currPrice < minPrice) {
            minPrice = currPrice;
            bestHotel = hotel;
          }
        }
      });
      if (tripNumber === 1) {
        dispatch(setTripOneHotelData(bestHotel));
      } else {
        dispatch(setTripTwoHotelData(bestHotel));
      }
    } catch (error) {
      console.error(error);
    }
  };

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
const initialState = {};

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
    default:
      return state;
  }
};

export const userTripReducer = (state = [], action) => {
  switch (action.type) {
    case SET_USER_TRIPS_HISTORY:
      return action.userTripHistory;
    default:
      return state;
  }
}

