import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { setTrip } from "../store/tripData";
import Modal from "./Modal";
import ErrorMessage from "./ErrorMessage";

const SearchResult = () => {
  const tripData = useSelector((state) => state.tripDataReducer);

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
  // Checking for successful API calls
  if (
    Object.keys(tripData).length >= 9 &&
    !tripOneFirstFlight["error"] &&
    !tripOneReturningFlight["error"] &&
    !tripOneHotelData["error"] &&
    !tripTwoFirstFlight["error"] &&
    !tripTwoReturningFlight["error"] &&
    !tripTwoHotelData["error"]
  ) {
    // Checking if any flights are unavailable
    if (
      !tripOneFirstFlight[1] ||
      !tripOneReturningFlight[1] ||
      !tripTwoFirstFlight[1] ||
      !tripTwoReturningFlight[1]
    ) {
      // Requesting the user to return to the home page to search a new flight
      return (
        <>
          <ErrorMessage
            message={
              "Flight not available. Please search a different trip or try again later"
            }
          />
        </>
      );
    }
    // Flights are available, so data from Redux store can be accessed without producing any errors
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
    // Returning search result
    return (
      <div className="container pt-6 box mb-6">
        <div className="box">
          <div className="trip-result-container">
            <div className="trip-1-result has-text-centered">
              <h2 className="title">Trip One</h2>
              <p>
                <span className="bold-text">Leaving from:</span>{" "}
                {tripOneDepartureCity}
              </p>
              <h2>
                <span className="bold-text">Going to:</span>{" "}
                {tripOneDestinationCity}
              </h2>
              <h3>
                {differenceOne > 0 ? (
                  <>
                    <span className="bold-text">Under budget:</span>{" "}
                    {` $${differenceOne.toFixed(2)}`}
                  </>
                ) : (
                  <>
                    <span className="bold-text">Over budget:</span>
                    {` $${Math.abs(differenceOne).toFixed(2)}`}
                  </>
                )}
              </h3>
            </div>
            <div className="trip-2-result has-text-centered">
              <h2 className="title">Trip Two</h2>
              <p>
                <span className="bold-text">Leaving from:</span>{" "}
                {tripTwoDepartureCity}
              </p>
              <h2>
                <span className="bold-text">Going to:</span>{" "}
                {tripTwoDestinationCity}
              </h2>
              <h3>
                {differenceTwo > 0 ? (
                  <>
                    <span className="bold-text">Under budget:</span>
                    {` $${differenceTwo.toFixed(2)}`}
                  </>
                ) : (
                  <>
                    <span className="bold-text">Over budget:</span>
                    {` $${Math.abs(differenceTwo).toFixed(2)}`}
                  </>
                )}
              </h3>
            </div>
          </div>
          <div className="trip-analysis">
            <p className="title">Analysis</p>
            <h2>
              <span className="bold-text">Cheaper to travel to:</span>{" "}
              {differenceOne > differenceTwo
                ? tripOneDestinationCity
                : tripTwoDestinationCity}
            </h2>
          </div>
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
        <Modal />
      </div>
    );
  }
  // Checking if any API calls produced an error
  else if (Object.keys(tripData).length >= 9) {
    if (
      tripOneFirstFlight["error"] ||
      tripOneReturningFlight["error"] ||
      tripOneHotelData["error"] ||
      tripTwoFirstFlight["error"] ||
      tripTwoReturningFlight["error"] ||
      tripTwoHotelData["error"]
    ) {
      // Returning error message
      return (
        <>
          <ErrorMessage
            message={
              "There was an error in loading your search. Please search a different trip or try again later"
            }
          />
        </>
      );
    }
  }
  // Checking if there is no trip data in the Redux store
  // This will return when the user refreshes /search-result
  else if (tripOneStayDuration === null || tripOneStayDuration === undefined) {
    return (
      <>
        <ErrorMessage
          message={"Please navigate to home page to search for trip"}
        />
      </>
    );
  }
  // Loading screen
  else {
    return (
      <div className="container navigate-home-container">
        <button className="button is-primary is-loading">Loading</button>
        <Modal />
      </div>
    );
  }
};

export default SearchResult;
