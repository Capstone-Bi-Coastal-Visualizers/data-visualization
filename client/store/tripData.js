import axios from 'axios'


//ACTION TYPES
const SET_FLIGHT_DATA
const SET_HOTEL_DATA

//ACTION CREATORS
const setFlightData = flightData => ({
    type: SET_FLIGHT_DATA,
    flightData
})

const setHotelData = hotelData => ({
    type: SET_HOTEL_DATA,
    hotelData
})

//Thunk Creators
export const fetchFlightData = (searchInput) => async dispatch => {
    const { originCode, departureCode, departureDate, returnDate } = searchInput
    try {
        const { data: flightSession } = await axios.get()
        const { data: flightData } = await axios.get()
        dispatch(setFlightData(trip))
    }
        catch (error) {
        next(error)
    }
}

export const fetchHotelData = (airportCoordinates) => async dispatch => {
    const { longitude, latitude } = airportCoordinates
    try {
        const { data: hotelData } = await axios.get()
        dispatch(setHotelData(trip))
    }
        catch (error) {
        next(error)
    }
}

//reducer
const initialState = []

const tripDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FLIGHT_DATA:
            return [...state, action.flightData]
        case SET_HOTEL_DATA:
            return [...state, action.hotelData]
        default:
            return state
    }
};

export default tripDataReducer
