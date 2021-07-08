import React from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";

const ConfirmationPage = () => {
  const tripData = useSelector((state) => state.tripDataReducer);
  const {
    tripOneFirstFlight,
    tripOneReturningFlight,
    tripOneHotelData,
    tripOneStayDuration,
    tripTwoFirstFlight,
    tripTwoReturningFlight,
    tripTwoHotelData,
    tripTwoStayDuration,
    selectedTrip,
  } = tripData;
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

  const selectedFlights = selectedTrip === 1 ? tripOneFlights : tripTwoFlights;
  const selectedHotel = selectedTrip === 1 ? tripOneHotel : tripTwoHotel;
  const difference = budget - selectedFlights - selectedHotel;
  const budgetLabel = difference >= 0 ? "Remaining budget" : "Over budget";
  const destination = selectedTrip === 1 ? destinationOne : destinationTwo;

  const data = {
    labels: [destination],
    datasets: [
      // These two will be in the same stack.
      {
        stack: arbitraryStackKey,
        label: "Flight",
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        data: [selectedFlights],
      },
      {
        stack: arbitraryStackKey,
        label: "Hotel",
        backgroundColor: ["rgba(54, 162, 235, 0.2)"],
        data: [selectedHotel],
      },
      {
        stack: arbitraryStackKey,
        label: budgetLabel,
        backgroundColor: ["rgba(0, 0, 0, 0.2)"],
        data: [Math.abs(difference)],
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
      <button>Email</button>
    </div>
  );
};

export default ConfirmationPage;
