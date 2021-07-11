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
    origin: "",
    destination: "",
    departureDate: "2021-07-15",
    returnDate: "2021-07-25",
  });

  const [secondTripState, setSecondTripState] = useState({
    origin: "",
    destination: "",
    departureDate: "2021-07-15",
    returnDate: "2021-07-25",
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
    const trip1Dest = firstTripState["destination"];
    const trip2Dest = secondTripState["destination"];
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
    <div className="container">
      <div className="field has-addons is-justify-content-center">
        <div className="control has-icons-right">
          <Autocomplete
            name="trip1Origin"
            label="airports"
            setTripAirportCode={setAirportCode}
            firstFlight={true}
            location="origin"
            placeholder="Leaving from"
          />
          <span class="icon is-small is-right">
            <i class="fas fa-plane-departure"></i>
          </span>
        </div>
        <div className="control has-icons-right ">
          <Autocomplete
            name="trip1Dest"
            label="airports"
            setTripAirportCode={setAirportCode}
            firstFlight={true}
            location="destination"
            placeholder="Going to"
          />
          <span class="icon is-small is-right">
            <i class="fas fa-plane-arrival"></i>
          </span>
        </div>
        <div className="control has-icons-right">
          <input
            type="date"
            placeholder="departure date"
            name="departureDate"
            className="input is-shadowless"
            required
            value={firstTripState.departureDate}
            onChange={(event) => {
              setFirstTripState({
                ...firstTripState,
                departureDate: event.target.value,
              });
            }}
          />
          <span class="icon is-small is-right">
            <i class="fas fa-calendar-week"></i>
          </span>
        </div>
        <div className="control has-icons-right">
          <input
            type="date"
            placeholder="return date"
            name="returnDate"
            className="input is-shadowless"
            required
            value={firstTripState.returnDate}
            onChange={(event) => {
              setFirstTripState({
                ...firstTripState,
                returnDate: event.target.value,
              });
            }}
          />
          <span class="icon is-small is-right">
            <i class="fas fa-calendar-week"></i>
          </span>
        </div>
      </div>
      <div className="field has-addons is-justify-content-center">
        <div className="control has-icons-right">
          <Autocomplete
            name="trip2Origin"
            label="airports"
            setTripAirportCode={setAirportCode}
            firstFlight={false}
            location="origin"
            placeholder="Leaving from"
          />
          <span class="icon is-small is-right">
            <i class="fas fa-plane-departure"></i>
          </span>
        </div>
        <div className="control has-icons-right">
          <Autocomplete
            name="trip2Dest"
            label="airports"
            setTripAirportCode={setAirportCode}
            firstFlight={false}
            location="destination"
            placeholder="Going to"
          />
          <span class="icon is-small is-right">
            <i class="fas fa-plane-arrival"></i>
          </span>
        </div>
        <div className="control has-icons-right">
          <input
            type="date"
            placeholder="departure date"
            name="departureDate"
            className="input is-shadowless"
            required
            value={secondTripState.departureDate}
            onChange={(event) => {
              setSecondTripState({
                ...secondTripState,
                departureDate: event.target.value,
              });
            }}
          />
          <span class="icon is-small is-right">
            <i class="fas fa-calendar-week"></i>
          </span>
        </div>
        <div className="control has-icons-right">
          <input
            type="date"
            placeholder="return date"
            name="returnDate"
            className="input is-shadowless"
            required
            value={secondTripState.returnDate}
            onChange={(event) => {
              setSecondTripState({
                ...secondTripState,
                returnDate: event.target.value,
              });
            }}
          />
          <span class="icon is-small is-right">
            <i class="fas fa-calendar-week"></i>
          </span>
        </div>
      </div>
      <div className="field has-addons is-justify-content-center">
        <div className="control ">
          <input
            type="text"
            placeholder="Budget"
            name="budget"
            className="input is-shadowless"
            required
            value={tripBudget}
            onChange={(event) => {
              setTripBudget(event.target.value);
            }}
          />
        </div>
        <div className="control">
          <Link
            to="/search-result"
            onClick={handleclick}
            className="button is-danger"
          >
            Submit
          </Link>
        </div>
      </div>
    </div>
  );
}
