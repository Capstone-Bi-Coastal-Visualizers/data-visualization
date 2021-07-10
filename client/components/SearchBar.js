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

  const [tripBudget, setTripBudget] = useState("");
  const [firstTripState, setFirstTripState] = useState({
    origin: "JFK",
    destination: "ORD",
    departureDate: "2021-07-10",
    returnDate: "2021-07-15",
  });

  const [secondTripState, setSecondTripState] = useState({
    origin: "IAH",
    destination: "LAX",
    departureDate: "2021-07-10",
    returnDate: "2021-07-15",
  });

  const [airportCoordinates, setAirportCoordinates] = useState({});

  const calcStayDuration = (startDate, endDate) => {
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    const differenceInTime = date2.getTime() - date1.getTime();
    return differenceInTime / (1000 * 3600 * 24);
  };

  const setAirportCode = (flightObj) => {
    const { firstFlight, location, code, lon, lat } = flightObj;
    if (firstFlight) {
      setFirstTripState({
        ...firstTripState,
        [location]: code,
      });
    } else {
      setSecondTripState({ ...secondTripState, [location]: code });
    }

    if (location === "destination") {
      setAirportCoordinates({
        ...airportCoordinates,
        [code]: [lon, lat],
      });
    }
  };

  const handleclick = () => {
    let returningFlight, tripNumber;
    dispatch(setBudget(tripBudget));
    dispatch(
      fetchFlightSession(
        firstTripState,
        (returningFlight = false),
        (tripNumber = 1)
      )
    );
    dispatch(
      fetchFlightSession(
        firstTripState,
        (returningFlight = true),
        (tripNumber = 1)
      )
    );
    dispatch(
      fetchFlightSession(
        secondTripState,
        (returningFlight = false),
        (tripNumber = 2)
      )
    );
    dispatch(
      fetchFlightSession(
        secondTripState,
        (returningFlight = true),
        (tripNumber = 2)
      )
    );
    // dispatch(fetchFlightSession(firstTripState, true));
    // const tripOneFirstFlight = {
    //   origin: firstTripState.origin,
    //   destination: firstTripState.destination,
    //   flightDate: firstTripState.departureDate,
    //   tripNumber: 1,
    // };
    // const tripTwoFirstFlight = {
    //   origin: secondTripState.origin,
    //   destination: secondTripState.destination,
    //   flightDate: secondTripState.departureDate,
    //   returningFlight: false,
    //   tripNumber: 2,
    // };
    // dispatch(fetchFlightSession(tripOneFirstFlight));
    // dispatch(fetchFlightSession(tripTwoFirstFlight));
    // const tripOneReturnFlight = {
    //   origin: firstTripState.destination,
    //   destination: firstTripState.origin,
    //   flightDate: firstTripState.returnDate,
    //   returningFlight: true,
    //   tripNumber: 1,
    // };
    // const tripTwoReturnFlight = {
    //   origin: secondTripState.destination,
    //   destination: secondTripState.origin,
    //   flightDate: secondTripState.returnDate,
    //   returningFlight: true,
    //   tripNumber: 2,
    // };
    // dispatch(fetchFlightSession(tripOneReturnFlight));
    // dispatch(fetchFlightSession(tripTwoReturnFlight));
    const trip1Dest = firstTripState["destination"];

    const trip2Dest = secondTripState["destination"];
    dispatch(
      fetchHotelData(
        airportCoordinates[trip1Dest],
        firstTripState.departureDate,
        1
      )
    );
    dispatch(
      fetchHotelData(
        airportCoordinates[trip2Dest],
        secondTripState.departureDate,
        2
      )
    );
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
        setTripAirportCode={setAirportCode}
        firstFlight={true}
        location="origin"
      />
      <Autocomplete
        name="airport"
        label="airports"
        placeholder="Begin typing in your airport"
        setTripAirportCode={setAirportCode}
        firstFlight={true}
        location="destination"
      />
      <input
        type="date"
        placeholder="departure date"
        name="departureDate"
        className="input"
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
        className="input"
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
        <Autocomplete
          name="airport"
          label="airports"
          placeholder="Begin typing in your airport"
          setTripAirportCode={setAirportCode}
          firstFlight={false}
          location="origin"
        />
        <Autocomplete
          name="airport"
          label="airports"
          placeholder="Begin typing in your airport"
          setTripAirportCode={setAirportCode}
          firstFlight={false}
          location="destination"
        />

        <input
          type="date"
          placeholder="departure date"
          name="departureDate"
          className="input"
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
          className="input"
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
        className="input"
        required
        value={tripBudget}
        onChange={(event) => {
          setTripBudget(event.target.value);
        }}
      />
      <Link
        to="/search-result"
        onClick={handleclick}
        className="button is-danger"
      >
        Submit
      </Link>
    </div>
  );
}
