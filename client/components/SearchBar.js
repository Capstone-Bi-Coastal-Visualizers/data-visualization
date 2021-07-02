import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchFlightData } from "../store/tripData";

export default function SearchBar() {
  // const [origin, setOrigin] = useState('');
  // const [destination, setDestination] = useState('');
  // const [departureDate, setDepartureDate] = useState('');
  // const [returnDate, setReturnDate] = useState('');
  // const [budget, setBudget] = useState('');

  const dispatch = useDispatch();

  const [state, setState] = useState({
    origin: "JFK",
    destination: "ORD",
    departureDate: "2021-08-10",
    returnDate: "2021-08-15",
    budget: "100",
  });
  const handleclick = () => {
    console.log("click triggered");
    console.log("API KEY", Env_Vars["API_KEY"]);
    dispatch(fetchFlightData(state));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="origin"
        name="origin"
        required
        value={state.origin}
        onChange={(event) => {
          setState({ ...state, origin: event.target.value });
        }}
      />
      <input
        type="text"
        placeholder="destination"
        name="destination"
        required
        value={state.destination}
        onChange={(event) => {
          setState({ ...state, destination: event.target.value });
        }}
      />
      <input
        type="date"
        placeholder="departure date"
        name="departureDate"
        required
        value={state.departureDate}
        onChange={(event) => {
          setState({ ...state, departureDate: event.target.value });
        }}
      />
      <input
        type="date"
        placeholder="return date"
        name="returnDate"
        required
        value={state.returnDate}
        onChange={(event) => {
          setState({ ...state, returnDate: event.target.value });
        }}
      />
      <input
        type="number"
        placeholder="budget"
        name="budget"
        required
        value={state.budget}
        onChange={(event) => {
          setState({ ...state, budget: event.target.value });
        }}
      />
      <button onClick={handleclick}>Submit</button>
      {/* <input type="text" placeholder="origin" name="origin" required value={origin} onChange={(event) => {setOrigin(event.target.value)}}/>
            <input type="text" placeholder="destination" name="destination" required value={destination} onChange={(event) => {setDestination(event.target.value)}}/>
            <input type="date" placeholder="departure date" name="departureDate" required value={departureDate} onChange={(event) => {setDepartureDate(event.target.value)}}/>
            <input type="date" placeholder="return date" name="returnDate" required value={returnDate} onChange={(event) => {setReturnDate(event.target.value)}}/>
            <input type="number" placeholder="budget" name="budget" required value={budget} onChange={(event) => {setBudget(event.target.value)}}/>
            <button onClick={handleclick}>Submit</button> */}
    </div>
  );
}
