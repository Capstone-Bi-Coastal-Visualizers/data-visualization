import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Autocomplete from "./AutoComplete";
import { fetchFlightSession, fetchHotelData } from "../store/tripData";


export default function SearchBar() {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    budget: "100",
    predictions: [],
  });
  const handleclick = () => {
    const firstFlight = {
      origin: state.origin,
      destination: state.destination,
      flightDate: state.departureDate,
      returningFlight: false,
    };
    dispatch(fetchFlightSession(firstFlight));
    const returnFlight = {
      origin: state.destination,
      destination: state.origin,
      flightDate: state.returnDate,
      returningFlight: true,
    };
    dispatch(fetchFlightSession(returnFlight));
    dispatch(
      fetchHotelData(
        { latitude: "12.91285", longitude: "100.87808" },
        state.departureDate
      )
    );
  };

  return (
    <div className="field has-addons">
      <div className="control">
        <Autocomplete
          name="airport"
          label="airports"
          placeholder="Begin typing in your airport"
          onChange={(event) => {
            setState({ ...state, origin: event.target.value });
          }}
        />
      </div>
      <div className="control">
        <input
          type="text"
          placeholder="destination"
          name="destination"
          className="input"
          required
          value={state.destination}
          onChange={(event) => {
            setState({ ...state, destination: event.target.value });
          }}
        />
      </div>
      <div className="control">
        <input
          type="date"
          placeholder="departure date"
          name="departureDate"
          className="input"
          required
          value={state.departureDate}
          onChange={(event) => {
            setState({ ...state, departureDate: event.target.value });
          }}
        />
      </div>
      <div className="control">
        <input
          type="date"
          placeholder="return date"
          name="returnDate"
          className="input"
          required
          value={state.returnDate}
          onChange={(event) => {
            setState({ ...state, returnDate: event.target.value });
          }}
        />
      </div>
      <div className="control">
        <input
          type="number"
          placeholder="budget"
          name="budget"
          className="input"
          required
          value={state.budget}
          onChange={(event) => {
            setState({ ...state, budget: event.target.value });
          }}
        />
      </div>
      <div className="control">
        <button className="button is-danger" onClick={handleclick}>
          Submit
        </button>
      </div>
    </div>
  );
}
