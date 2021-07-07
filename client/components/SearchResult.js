import React from "react";
import { useSelector } from "react-redux";
import BarChart from "./BarChart";
import { Bar } from "react-chartjs-2";

const SearchResult = () => {
  const tripData = useSelector((state) => state.tripDataReducer);
  console.log(tripData, "-------------------");
  const { firstFlight, returningFlight, hotelData } = tripData;
  console.log("first flight data", firstFlight);
  // const price = firstFlight[1] || [];
  // console.log("flight price", price);
  console.log("trip data length", Object.keys(tripData).length);

  if (Object.keys(tripData).length === 3) {
    console.log(firstFlight[1].MinPrice);
    const flightOne = firstFlight[1].MinPrice + returningFlight[1].MinPrice;
    const flightTwo = 140.0;
    const hotelOne = hotelData.price.split(" ")[0].split("$")[1];
    const hotelTwo = 180;
    const budget = 300;
    const destinationOne = hotelData.location_string;
    const destinationTwo = "New York";

    const arbitraryStackKey = "stack1";

    const differenceOne = budget - flightOne - hotelOne;
    const differenceTwo = budget - flightTwo - hotelTwo;
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
          data: [flightOne, flightTwo],
        },
        {
          stack: arbitraryStackKey,
          label: "Hotel",
          backgroundColor: [
            "rgba(54, 162, 235, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          data: [hotelOne, hotelTwo],
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
    return <h2>LOADING DATA</h2>;
  }
};

export default SearchResult;
