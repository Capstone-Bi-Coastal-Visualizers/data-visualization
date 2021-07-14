import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { setTrip } from "../store/tripData";

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
            There was an error in loading your search. Please search a different
            trip or try again later
          </h2>
          <Link to="/" className="button mt-3">
            Return
          </Link>
        </div>
      );
    }
    const tripOneFlights =
      tripOneFirstFlight[1].MinPrice + tripOneReturningFlight[1].MinPrice;
    const tripTwoFlights =
      tripTwoFirstFlight[1].MinPrice + tripTwoReturningFlight[1].MinPrice;
    const tripOneHotel =
      tripOneHotelData.price.split(" ")[0].split("$")[1] * tripOneStayDuration;
    const tripTwoHotel =
      tripTwoHotelData.price.split(" ")[0].split("$")[1] * tripTwoStayDuration;
    const budget = tripData.budget;
    const destinationOne = tripOneHotelData.location_string;
    const destinationTwo = tripTwoHotelData.location_string;

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

    const differenceOne = budget - tripOneFlights - tripOneHotel;
    const differenceTwo = budget - tripTwoFlights - tripTwoHotel;
    const budgetOneBackgroundColor =
      differenceOne > 0 ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)";
    const budgetTwoBackgroundColor =
      differenceTwo > 0 ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)";
    const data = {
      labels: [tripOneDestinationCity, tripTwoDestinationCity],
      datasets: [
        // These two will be in the same stack.
        {
          stack: arbitraryStackKey,
          label: "Flight",
          backgroundColor: [
            "rgba(54, 162, 235, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          data: [tripOneFlights, tripTwoFlights],
        },
        {
          stack: arbitraryStackKey,
          label: "Hotel",
          backgroundColor: [
            "rgba(255, 206, 86, 0.2)",
            "rgba(255, 206, 86, 0.2)",
          ],
          data: [tripOneHotel, tripTwoHotel],
        },
        {
          stack: arbitraryStackKey,
          label: "Budget",
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
              className="button"
              onClick={() => dispatch(setTrip(1))}
            >
              Select Trip One
            </Link>
            <Link
              to="/confirmation-page"
              className="button"
              onClick={() => dispatch(setTrip(2))}
            >
              Select Trip Two
            </Link>
          </div>
          <Bar data={data} options={options} />
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
          <Link to="/" className="button mt-3">
            Return
          </Link>
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
        <Link to="/" className="button mt-3">
          Return
        </Link>
      </div>
    );
  } else {
    return (
      <div className="container navigate-home-container">
        <h2>Please wait loading data...</h2>
      </div>
    );
  }
};

export default SearchResult;
