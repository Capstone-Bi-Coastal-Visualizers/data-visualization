import React from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";

const SearchResult = () => {
  const tripData = useSelector((state) => state.tripDataReducer);
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
  if (Object.keys(tripData).length === 9) {
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
    const data = {
      labels: [destinationOne, destinationTwo],
      datasets: [
        // These two will be in the same stack.
        {
          stack: arbitraryStackKey,
          label: "Flight",
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 99, 132, 0.2)",
          ],
          data: [tripOneFlights, tripTwoFlights],
        },
        {
          stack: arbitraryStackKey,
          label: "Hotel",
          backgroundColor: [
            "rgba(54, 162, 235, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          data: [tripOneHotel, tripTwoHotel],
        },
        {
          stack: arbitraryStackKey,
          label: "Budget",
          backgroundColor: ["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.2)"],
          data: [differenceOne, differenceTwo],
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
      <div>
        <Bar data={data} options={options} />
        <Link to="/confirmation-page"> Select Trip One </Link>
        <Link to="/confirmation-page"> Select Trip Two </Link>

        <h2>{destinationOne}</h2>
        <h3>
          {differenceOne > 0
            ? `Under budget by $${differenceOne.toFixed(2)}`
            : `Over budget by $${Math.abs(differenceOne).toFixed(2)}`}
        </h3>
        <h2>{destinationTwo}</h2>
        <h3>
          {differenceTwo > 0
            ? `Under budget by $${differenceTwo.toFixed(2)}`
            : `Over budget by $${Math.abs(differenceTwo).toFixed(2)}`}
        </h3>
        <h2>
          Cheaper to travel to:{" "}
          {differenceOne > differenceTwo ? destinationOne : destinationTwo}
        </h2>
      </div>
    );
  } else {
    return <h2>PLEASAE WAIT, LOADING DATA</h2>;
  }
};

export default SearchResult;
