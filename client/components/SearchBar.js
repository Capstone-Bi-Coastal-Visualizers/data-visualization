import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Autocomplete from "./AutoComplete";
import {
  fetchFlightSession,
  fetchHotelData,
  setBudget,
  setTripOneStayDuration,
  setTripTwoStayDuration,
  deleteTrip,
} from "../store/tripData";

export default function SearchBar() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [flight1Validation, setFlight1Validation] = useState([]);
  const [flight2Validation, setFlight2Validation] = useState([]);
  const [flight1DateValid, setFlight1DateValid] = useState(true);
  const [flight2DateValid, setFlight2DateValid] = useState(true);
  const [tripBudget, setTripBudget] = useState("");
  const todayDate = new Date();
  const date = new Date(todayDate.getTime() + 86400000);
  const month = date.getMonth() + 1;
  const monthString =
    month.toString().length === 2 ? month + 1 : "0" + month.toString();
  const defaultDepartureDate = `${date.getFullYear()}-${monthString}-${date.getDate()}`;
  const ReturnDateValue = new Date(date.getTime() + 86400000 * 5);
  const ReturnDateMonth = ReturnDateValue.getMonth() + 1;
  const ReturnDateMonthString =
    ReturnDateMonth.toString().length === 2
      ? ReturnDateMonth + 1
      : "0" + ReturnDateMonth.toString();
  const defaultReturnDate = `${ReturnDateValue.getFullYear()}-${ReturnDateMonthString}-${ReturnDateValue.getDate()}`;
  const [firstTripState, setFirstTripState] = useState({
    origin: null,
    destination: null,
    departureDate: defaultDepartureDate,
    returnDate: defaultReturnDate,
  });

  const [secondTripState, setSecondTripState] = useState({
    origin: null,
    destination: null,
    departureDate: defaultDepartureDate,
    returnDate: defaultReturnDate,
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

  const checkValidInputs = () => {
    let flight1 = [];
    let flight2 = [];
    for (const prop in firstTripState) {
      if (!firstTripState[prop]) {
        flight1.push(prop);
      }
    }
    for (const prop in secondTripState) {
      if (!secondTripState[prop]) {
        flight2.push(prop);
      }
    }
    setFlight1Validation(flight1);
    setFlight2Validation(flight2);

    let flight1Dates = calcStayDuration(
      firstTripState.departureDate,
      firstTripState.returnDate
    );
    let flight2Dates = calcStayDuration(
      secondTripState.departureDate,
      secondTripState.returnDate
    );

    if (flight1Dates < 0) setFlight1DateValid(false);
    if (flight2Dates < 0) setFlight2DateValid(false);

    if (Number(tripBudget) <= 0 || !Number(tripBudget)) {
      setTripBudget(" ");
      return false;
    }

    if (
      flight1.length > 0 ||
      flight2.length > 0 ||
      flight1Dates < 0 ||
      flight2Dates < 0 ||
      tripBudget === "" ||
      tripBudget < 0
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleclick = () => {
    if (checkValidInputs()) {
      dispatch(deleteTrip());
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
      history.push("/search-result");
    }
  };

  return (
    <div className="search-container">
      <div className="box-test input-container">
        <div className="field has-addons is-justify-content-center">
          <div className="control has-icons-right">
            <Autocomplete
              name="trip1Origin"
              label="airports"
              setTripAirportCode={setAirportCode}
              firstFlight={true}
              location="origin"
              placeholder="Leaving from"
              valid={flight1Validation}
            />
            <span className="icon is-small is-right">
              <i className="fas fa-plane-departure"></i>
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
              valid={flight1Validation}
            />
            <span className="icon is-small is-right">
              <i className="fas fa-plane-arrival"></i>
            </span>
          </div>
          <div className="control">
            <input
              type="date"
              placeholder="departure date"
              name="departureDate"
              className={`input ${
                !flight1DateValid ? "is-danger is-outlined" : ""
              }`}
              required
              value={firstTripState.departureDate}
              onChange={(event) => {
                setFirstTripState({
                  ...firstTripState,
                  departureDate: event.target.value,
                });
              }}
            />
          </div>
          <div className="control">
            <input
              type="date"
              placeholder="return date"
              name="returnDate"
              className={`input ${
                !flight1DateValid ? "is-danger is-outlined" : ""
              }`}
              required
              value={firstTripState.returnDate}
              onChange={(event) => {
                setFirstTripState({
                  ...firstTripState,
                  returnDate: event.target.value,
                });
              }}
            />
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
              valid={flight2Validation}
            />
            <span className="icon is-small is-right">
              <i className="fas fa-plane-departure"></i>
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
              valid={flight2Validation}
            />
            <span className="icon is-small is-right">
              <i className="fas fa-plane-arrival"></i>
            </span>
          </div>
          <div className="control">
            <input
              type="date"
              placeholder="departure date"
              name="departureDate"
              className={`input ${
                !flight2DateValid ? "is-danger is-outlined" : ""
              }`}
              required
              value={secondTripState.departureDate}
              onChange={(event) => {
                setSecondTripState({
                  ...secondTripState,
                  departureDate: event.target.value,
                });
              }}
            />
          </div>
          <div className="control">
            <input
              type="date"
              placeholder="return date"
              name="returnDate"
              className={`input ${
                !flight2DateValid ? "is-danger is-outlined" : ""
              }`}
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
        </div>
        <div className="field has-addons is-justify-content-center">
          <div className="control ">
            <input
              type="text"
              placeholder="$ Budget"
              name="budget"
              className={`input ${
                tripBudget === " " ? "is-danger is-outlined" : ""
              }`}
              required
              value={tripBudget}
              onChange={(event) => {
                setTripBudget(event.target.value);
              }}
            />
          </div>
          <div className="control">
            <button onClick={handleclick} className="button is-primary">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
