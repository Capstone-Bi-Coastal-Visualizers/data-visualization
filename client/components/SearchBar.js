import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Autocomplete from "./AutoComplete";
import {
  fetchFlightSession,
  fetchHotelData,
  setBudget,
  setTripOneStayDuration,
  setTripTwoStayDuration,
} from "../store/tripData";

export default function SearchBar() {
  const dispatch = useDispatch();

  const [firstTripState, setFirstTripState] = useState({
    origin: "JFK",
    destination: "ORD",
    departureDate: "2021-07-20",
    returnDate: "2021-07-27",
    budget: "100",
    predictions: [],
  });
  const [secondTripState, setSecondTripState] = useState({
    origin: "IAH",
    destination: "LAX",
    departureDate: "2021-07-20",
    returnDate: "2021-07-27",
  });

  const calcStayDuration = (startDate, endDate) => {
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    const differenceInTime = date2.getTime() - date1.getTime();
    return differenceInTime / (1000 * 3600 * 24);
  };

  const handleclick = () => {
    const tripOneFirstFlight = {
      origin: firstTripState.origin,
      destination: firstTripState.destination,
      flightDate: firstTripState.departureDate,
      returningFlight: false,
      tripNumber: 1,
    };
    const tripTwoFirstFlight = {
      origin: secondTripState.origin,
      destination: secondTripState.destination,
      flightDate: secondTripState.departureDate,
      returningFlight: false,
      tripNumber: 2,
    };
    dispatch(fetchFlightSession(tripOneFirstFlight));
    dispatch(fetchFlightSession(tripTwoFirstFlight));
    const tripOneReturnFlight = {
      origin: firstTripState.destination,
      destination: firstTripState.origin,
      flightDate: firstTripState.returnDate,
      returningFlight: true,
      tripNumber: 1,
    };
    const tripTwoReturnFlight = {
      origin: secondTripState.destination,
      destination: secondTripState.origin,
      flightDate: secondTripState.returnDate,
      returningFlight: true,
      tripNumber: 2,
    };
    dispatch(fetchFlightSession(tripOneReturnFlight));
    dispatch(fetchFlightSession(tripTwoReturnFlight));
    dispatch(
      fetchHotelData(
        { latitude: "12.91285", longitude: "100.87808" },
        firstTripState.departureDate,
        1
      )
    );
    dispatch(
      fetchHotelData(
        { latitude: "12.91285", longitude: "100.87808" },
        secondTripState.departureDate,
        2
      )
    );
    dispatch(setBudget(firstTripState.budget));
    dispatch(
      setTripOneStayDuration(
        calcStayDuration(
          firstTripState.departureDate,
          firstTripState.returnDate
        )
      )
    );
    dispatch(
      setTripTwoStayDuration(
        calcStayDuration(
          secondTripState.departureDate,
          secondTripState.returnDate
        )
      )
    );
  };

  return (
    <div>
      <Autocomplete
        name="airport"
        label="airports"
        placeholder="Begin typing in your airport"
        onChange={(event) => {
          setState({ ...state, origin: event.target.value });
        }}
      />
      <input
        type="text"
        placeholder="origin"
        name="origin"
        required
        value={firstTripState.origin}
        onChange={(event) => {
          setFirstTripState({ ...firstTripState, origin: event.target.value });
        }}
      />
      <input
        type="text"
        placeholder="destination"
        name="destination"
        required
        value={firstTripState.destination}
        onChange={(event) => {
          setFirstTripState({
            ...firstTripState,
            destination: event.target.value,
          });
        }}
      />
      <input
        type="date"
        placeholder="departure date"
        name="departureDate"
        required
        value={firstTripState.departureDate}
        onChange={(event) => {
          setFirstTripState({
            ...firstTripState,
            departureDate: event.target.value,
          });
        }}
      />
      <input
        type="date"
        placeholder="return date"
        name="returnDate"
        required
        value={firstTripState.returnDate}
        onChange={(event) => {
          setFirstTripState({
            ...firstTripState,
            returnDate: event.target.value,
          });
        }}
      />
      <div>
        <input
          type="text"
          placeholder="origin"
          name="origin"
          required
          value={secondTripState.origin}
          onChange={(event) => {
            setSecondTripState({
              ...secondTripState,
              origin: event.target.value,
            });
          }}
        />
        <input
          type="text"
          placeholder="destination"
          name="destination"
          required
          value={secondTripState.destination}
          onChange={(event) => {
            setSecondTripState({
              ...secondTripState,
              destination: event.target.value,
            });
          }}
        />
        <input
          type="date"
          placeholder="departure date"
          name="departureDate"
          required
          value={secondTripState.departureDate}
          onChange={(event) => {
            setSecondTripState({
              ...secondTripState,
              departureDate: event.target.value,
            });
          }}
        />
        <input
          type="date"
          placeholder="return date"
          name="returnDate"
          required
          value={secondTripState.returnDate}
          onChange={(event) => {
            setSecondTripState({
              ...secondTripState,
              returnDate: event.target.value,
            });
          }}
        />
      </div>
      <input
        type="number"
        placeholder="budget"
        name="budget"
        required
        value={firstTripState.budget}
        onChange={(event) => {
          setFirstTripState({ ...firstTripState, budget: event.target.value });
        }}
      />
      <Link to="/search-result" onClick={handleclick}>
        Submit
      </Link>
    </div>
  );
}
