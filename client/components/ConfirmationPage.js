import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import Modal from "react-modal";

const ConfirmationPage = () => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

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
  const tripOneHotelCost =
    tripOneHotelData.price.split(" ")[0].split("$")[1] * tripOneStayDuration;
  const tripTwoHotelCost =
    tripTwoHotelData.price.split(" ")[0].split("$")[1] * tripTwoStayDuration;
  const budget = tripData.budget;
  const destinationOne = tripOneHotelData.location_string;
  const destinationTwo = tripTwoHotelData.location_string;

  const tripFirstFlight =
    selectedTrip === 1 ? tripOneFirstFlight : tripTwoFirstFlight;
  const tripReturningFlight =
    selectedTrip === 1 ? tripOneReturningFlight : tripTwoReturningFlight;
  const tripHotel = selectedTrip === 1 ? tripOneHotelData : tripTwoHotelData;

  const departureAirport = tripFirstFlight[2].filter((airportId) => {
    return airportId.PlaceId === tripFirstFlight[1].OutboundLeg.OriginId;
  })[0].SkyscannerCode;

  const destinationAirport = tripReturningFlight[2].filter((airportId) => {
    return airportId.PlaceId === tripReturningFlight[1].OutboundLeg.OriginId;
  })[0].SkyscannerCode;

  const departureDate =
    tripFirstFlight[1].OutboundLeg.DepartureDate.split("T")[0];
  const returnDate =
    tripReturningFlight[1].OutboundLeg.DepartureDate.split("T")[0];
  const nights = selectedTrip === 1 ? tripOneStayDuration : tripTwoStayDuration;

  const arbitraryStackKey = "stack1";

  const selectedFlights = selectedTrip === 1 ? tripOneFlights : tripTwoFlights;
  const selectedHotel =
    selectedTrip === 1 ? tripOneHotelCost : tripTwoHotelCost;
  const difference = budget - selectedFlights - selectedHotel;
  const budgetLabel = difference >= 0 ? "Remaining budget" : "Over budget";
  const destination = selectedTrip === 1 ? destinationOne : destinationTwo;

  const hotelCoordinates =
    selectedTrip === 1 ? tripOneHotelData : tripTwoHotelData;
  const destCoordinates = [
    hotelCoordinates.latitude,
    hotelCoordinates.longitude,
  ];

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

  // TODO!!: Display msg that says, "E-mail was sent!" & redirect user to trips page after clicking email button.
  // TODO!!: If user is not logged in, have a message pop up that has asks them to sign in.
  const handleClick = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      await axios.post(
        "/api/trips",
        {
          originAirport: departureAirport,
          destinationAirport,
          departureDate,
          returnDate,
          airfareCost: selectedFlights,
          hotelCost: selectedHotel,
          budget,
          destCoordinates,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
      await axios.post(
        "/api/users/email",
        {
          departureAirport,
          departureDate,
          destinationAirport,
          returnDate,
          hotel: tripHotel.name,
          nights,
          airfare: selectedFlights,
          hotelPrice: selectedHotel,
          total: selectedFlights + selectedHotel,
          budget,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
    } else {
      toggleModal();
    }
  };

  return (
    <div>
      <Bar data={data} options={options} />
      <button onClick={handleClick}>Email</button>
      <Modal isOpen={showModal}>
        <h2>Please Login or Sign-Up To User This Service!</h2>
        <div>
          <button onClick={toggleModal}>Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmationPage;
