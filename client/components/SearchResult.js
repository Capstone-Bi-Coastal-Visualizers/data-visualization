import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { setTrip } from "../store/tripData";
import { Login, Signup } from "./AuthForm";
import { toggleModal, modalContent } from "../store/auth";

const SearchResult = () => {
  const tripData = useSelector((state) => state.tripDataReducer);
  const auth = useSelector((state) => state.auth);
  const { showModal, displayName } = auth;
  const resetDisplayName = () => {
    dispatch(toggleModal());
    dispatch(modalContent(""));
  };

  const dispatch = useDispatch();
  const {
    tripOneFirstFlight,
    tripOneReturningFlight,
    tripOneHotelData,
    tripOneStayDuration,
  } = tripData;
  const {
    tripTwoFirstFlight,
    tripTwoReturningFlight,
    tripTwoHotelData,
    tripTwoStayDuration,
  } = tripData;
  if (
    Object.keys(tripData).length >= 9 &&
    !tripOneFirstFlight["error"] &&
    !tripOneReturningFlight["error"] &&
    !tripOneHotelData["error"] &&
    !tripTwoFirstFlight["error"] &&
    !tripTwoReturningFlight["error"] &&
    !tripTwoHotelData["error"]
  ) {
    if (
      !tripOneFirstFlight[1] ||
      !tripOneReturningFlight[1] ||
      !tripTwoFirstFlight[1] ||
      !tripTwoReturningFlight[1]
    ) {
      return (
        <div className="container navigate-home-container">
          <h2>
            Flight not available. Please search a different trip or try again
            later
          </h2>
          <Link to="/" className="button is-primary mt-3">
            Return
          </Link>
          <div className={`modal ${showModal ? "is-active" : ""}`}>
            <div className="modal-background"></div>
            <div className="modal-content">
              {displayName === "Login" ? <Login /> : <Signup />}
            </div>
            <button
              className="modal-close is-large"
              aria-label="close"
              onClick={resetDisplayName}
            ></button>
          </div>
        </div>
      );
    }
    const tripOneFlights =
      tripOneFirstFlight[1].MinPrice + tripOneReturningFlight[1].MinPrice;
    const tripTwoFlights =
      tripTwoFirstFlight[1].MinPrice + tripTwoReturningFlight[1].MinPrice;
    const tripOneHotelNightlyRate = tripOneHotelData.price
      .split(" ")[0]
      .split("$")[1];
    const tripTwoHotelNightlyRate = tripTwoHotelData.price
      .split(" ")[0]
      .split("$")[1];
    const tripOneHotelCost =
      tripOneStayDuration === 0
        ? tripOneHotelNightlyRate * 1
        : tripOneHotelNightlyRate * tripOneStayDuration;
    const tripTwoHotelCost =
      tripTwoStayDuration === 0
        ? tripTwoHotelNightlyRate * 1
        : tripTwoHotelNightlyRate * tripTwoStayDuration;
    const budget = tripData.budget;

    const tripOneDepartureCity = tripOneFirstFlight[2].filter((airportId) => {
      return airportId.PlaceId === tripOneFirstFlight[1].OutboundLeg.OriginId;
    })[0].CityName;

    const tripOneDestinationCity = tripOneReturningFlight[2].filter(
      (airportId) => {
        return (
          airportId.PlaceId === tripOneReturningFlight[1].OutboundLeg.OriginId
        );
      }
    )[0].CityName;

    const tripTwoDepartureCity = tripTwoFirstFlight[2].filter((airportId) => {
      return airportId.PlaceId === tripTwoFirstFlight[1].OutboundLeg.OriginId;
    })[0].CityName;

    const tripTwoDestinationCity = tripTwoReturningFlight[2].filter(
      (airportId) => {
        return (
          airportId.PlaceId === tripTwoReturningFlight[1].OutboundLeg.OriginId
        );
      }
    )[0].CityName;

    const arbitraryStackKey = "stack1";

    const differenceOne = budget - tripOneFlights - tripOneHotelCost;
    const differenceTwo = budget - tripTwoFlights - tripTwoHotelCost;
    const budgetOneBackgroundColor =
      differenceOne > 0 ? "rgba(5, 226, 205, 0.2)" : "rgba(255, 95, 160, 0.2)";
    const budgetTwoBackgroundColor =
      differenceTwo > 0 ? "rgba(5, 226, 205, 0.2)" : "rgba(255, 95, 160, 0.2)";
    const data = {
      labels: [tripOneDestinationCity, tripTwoDestinationCity],
      datasets: [
        // These two will be in the same stack.
        {
          stack: arbitraryStackKey,
          label: "Airfare $",
          backgroundColor: [
            "rgba(50, 155, 220, 0.2)",
            "rgba(50, 155, 220, 0.2)",
          ],
          data: [tripOneFlights, tripTwoFlights],
        },
        {
          stack: arbitraryStackKey,
          label: "Accommodations $",
          backgroundColor: [
            "rgba(255, 255, 100, 0.2)",
            "rgba(255, 255, 100, 0.2)",
          ],
          data: [tripOneHotelCost, tripTwoHotelCost],
        },
        {
          stack: arbitraryStackKey,
          label: "Budget $",
          backgroundColor: [budgetOneBackgroundColor, budgetTwoBackgroundColor],
          data: [Math.abs(differenceOne), Math.abs(differenceTwo)],
        },
      ],
    };

    const options = {
      // scaleLabel: currency(80),
      scales: {
        yAxes: [
          {
            stacked: true,
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            stacked: true,
          },
        ],
      },
    };

    return (
      <div className="container pt-6">
        <div className="trip-result-container">
          <div className="trip-1-result has-text-centered">
            <h2 className="title">Trip One</h2>
            <p>
              <span>Leaving from:</span> {tripOneDepartureCity}
            </p>
            <h2>
              <span>Going to:</span> {tripOneDestinationCity}
            </h2>
            <h3>
              {differenceOne > 0
                ? `Under budget by $${differenceOne.toFixed(2)}`
                : `Over budget by $${Math.abs(differenceOne).toFixed(2)}`}
            </h3>
          </div>
          <div className="trip-2-result has-text-centered">
            <h2 className="title">Trip Two</h2>
            <p>
              <span>Leaving from:</span> {tripTwoDepartureCity}
            </p>
            <h2>
              <span>Going to:</span> {tripTwoDestinationCity}
            </h2>
            <h3>
              {differenceTwo > 0
                ? `Under budget by $${differenceTwo.toFixed(2)}`
                : `Over budget by $${Math.abs(differenceTwo).toFixed(2)}`}
            </h3>
          </div>
        </div>
        <div className="trip-analysis">
          <p className="title">Analysis</p>
          <h2>
            Cheaper to travel to:{" "}
            {differenceOne > differenceTwo
              ? tripOneDestinationCity
              : tripTwoDestinationCity}
          </h2>
        </div>
        <div className="trips-bar-chart">
          <div className="trips-bar-chart-selector">
            <Link
              to="/confirmation-page"
              budgetLabel
              className="button is-primary "
              onClick={() => dispatch(setTrip(1))}
            >
              Select Trip One
            </Link>
            <Link
              to="/confirmation-page"
              className="button is-primary "
              onClick={() => dispatch(setTrip(2))}
            >
              Select Trip Two
            </Link>
          </div>
          <Bar data={data} options={options} />
        </div>
        <div className={`modal ${showModal ? "is-active" : ""}`}>
          <div className="modal-background"></div>
          <div className="modal-content">
            {displayName === "Login" ? <Login /> : <Signup />}
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={resetDisplayName}
          ></button>
        </div>
        <div className={`modal ${showModal ? "is-active" : ""}`}>
          <div className="modal-background"></div>
          <div className="modal-content">
            {displayName === "Login" ? <Login /> : <Signup />}
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={resetDisplayName}
          ></button>
        </div>
      </div>
    );
  } else if (Object.keys(tripData).length >= 9) {
    if (
      tripOneFirstFlight["error"] ||
      tripOneReturningFlight["error"] ||
      tripOneHotelData["error"] ||
      tripTwoFirstFlight["error"] ||
      tripTwoReturningFlight["error"] ||
      tripTwoHotelData["error"]
    ) {
      return (
        <div className="container navigate-home-container">
          <h2>
            There was an error in loading your search. Please search a different
            trip or try again later
          </h2>
          <Link to="/" className="button is-primary mt-3">
            Return
          </Link>
          <div className={`modal ${showModal ? "is-active" : ""}`}>
            <div className="modal-background"></div>
            <div className="modal-content">
              {displayName === "Login" ? <Login /> : <Signup />}
            </div>
            <button
              className="modal-close is-large"
              aria-label="close"
              onClick={resetDisplayName}
            ></button>
          </div>
        </div>
      );
    }
  } else if (
    tripOneStayDuration === null ||
    tripOneStayDuration === undefined
  ) {
    return (
      <div className="container navigate-home-container">
        <h2>Please navigate to home page to search for trip</h2>
        <Link to="/" className="button is-primary mt-3">
          Return
        </Link>
        <div className={`modal ${showModal ? "is-active" : ""}`}>
          <div className="modal-background"></div>
          <div className="modal-content">
            {displayName === "Login" ? <Login /> : <Signup />}
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={resetDisplayName}
          ></button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container navigate-home-container">
        <button className="button is-primary is-loading">Loading</button>
      </div>
    );
  }
};

export default SearchResult;
