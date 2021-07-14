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
        <div className="navigate-home-container">
          <h2>
            There was an error in loading your search. Please search a different
            trip or try again later
          </h2>
          <div className="control">
            <Link to="/" className="button is-danger">
              Return
            </Link>
          </div>
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

    const arbitraryStackKey = "stack1";

    const differenceOne = budget - tripOneFlights - tripOneHotel;
    const differenceTwo = budget - tripTwoFlights - tripTwoHotel;
    const budgetOneBackgroundColor =
      differenceOne > 0 ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)";
    const budgetTwoBackgroundColor =
      differenceTwo > 0 ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)";
    const data = {
      labels: [destinationOne, destinationTwo],
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
      <div className="container">
        <div className="result-container">
          <div className="trip-result-container">
            <div className="trip-1-result">
              <h2 className="title">Result 1</h2>
              <p>
                <span className="subtitle">Leaving from:</span>{" "}
                {tripOneFirstFlight[2][1].CityName}
              </p>
              <h2>
                <span className="subtitle">Going to:</span> {destinationOne}
              </h2>
              <h3>
                {differenceOne > 0
                  ? `Under budget by $${differenceOne.toFixed(2)}`
                  : `Over budget by $${Math.abs(differenceOne).toFixed(2)}`}
              </h3>
            </div>
            <div className="trip-2-result">
              <h2 className="title">Result 2</h2>
              <p>
                <span className="subtitle">Leaving from:</span>{" "}
                {tripTwoFirstFlight[2][1].CityName}
              </p>
              <h2>
                <span className="subtitle">Going to:</span> {destinationTwo}
              </h2>
              <h3>
                {differenceTwo > 0
                  ? `Under budget by $${differenceTwo.toFixed(2)}`
                  : `Over budget by $${Math.abs(differenceTwo).toFixed(2)}`}
              </h3>
            </div>
          </div>
          <div className="trip-analysis">
            <p className="title">Trip Analysis</p>
            <h2>
              Cheaper to travel to:{" "}
              {differenceOne > differenceTwo ? destinationOne : destinationTwo}
            </h2>
            {/* <Link to="/confirmation-page" onClick={() => dispatch(setTrip(1))}>
              {" "}
              Select Trip One{" "}
            </Link>
            <Link to="/confirmation-page" onClick={() => dispatch(setTrip(2))}>
              {" "}
              Select Trip Two{" "}
            </Link> */}
          </div>
          <div className="trips-bar-chart">
            <div className="trips-bar-chart-selector">
              <Link
                to="/confirmation-page"
                onClick={() => dispatch(setTrip(1))}
              >
                <button className="button"> Select Trip One </button>
              </Link>
              <Link
                to="/confirmation-page"
                onClick={() => dispatch(setTrip(2))}
              >
                <button className="button"> Select Trip Two </button>
              </Link>
            </div>
            <Bar data={data} options={options} />
          </div>
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
        <div className="navigate-home-container">
          <h2>
            There was an error in loading your search. Please search a different
            trip or try again later
          </h2>
          <Link to="/">
            <button className="button">Return</button>
          </Link>
        </div>
      );
    }
  } else if (
    tripOneStayDuration === null ||
    tripOneStayDuration === undefined
  ) {
    return (
      <div className="container">
        <div className="navigate-home-error">
          <div>Please navigate to home page to search for trip</div>
        </div>
          <Link to="/">
            <button className="button">Return</button>
          </Link>
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className="navigate-home-error">
          <div>Please wait loading data...</div>
        </div>
      </div>
    );
  }
};

export default SearchResult;
