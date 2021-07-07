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
  try {
    const { origin, destination, flightDate, returningFlight } = searchInput;
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

    if (returningFlight === false) {
      dispatch(setFirstFlight(bestFlight));
    } else {
      dispatch(setReturningFlight(bestFlight));
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchHotelData =
  (airportCoordinates, departureDate) => async (dispatch) => {
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
      dispatch(setHotelData(bestHotel));
    } catch (error) {
      console.error(error);
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
