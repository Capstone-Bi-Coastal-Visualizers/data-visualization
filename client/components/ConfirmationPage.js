import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import Modal from "react-modal";
import { Link, useHistory } from "react-router-dom";

Modal.setAppElement("#app");
const ConfirmationPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [count, setCount] = useState(0);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const history = useHistory();
  const toggleConfirmModal = () => {
    if (count === 0) {
      setShowConfirmModal(!showConfirmModal);
      setCount(1);
    } else {
      setShowConfirmModal(!showConfirmModal);
      //redirect to trips page here
      history.push("/trips");
    }
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
  const budgetBackgroundColor =
    difference > 0 ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 255, 0, 0.2)";
  const hotelCoordinates =
    selectedTrip === 1 ? tripOneHotelData : tripTwoHotelData;
  const destCoordinates = [
    hotelCoordinates.latitude,
    hotelCoordinates.longitude,
  ];
  const tripFlightNameArray = [tripFirstFlight[0].Name];
  if (tripFirstFlight[0].Name !== tripReturningFlight[0].Name) {
    tripFlightNameArray.push(tripReturningFlight[0].Name);
  }

  const data = {
    labels: [destination],
    datasets: [
      // These two will be in the same stack.
      {
        stack: arbitraryStackKey,
        label: "Flight",
        backgroundColor: ["rgba(54, 162, 235, 0.2)"],
        data: [selectedFlights],
      },
      {
        stack: arbitraryStackKey,
        label: "Hotel",
        backgroundColor: ["rgba(255, 206, 86, 0.2)"],
        data: [selectedHotel],
      },
      {
        stack: arbitraryStackKey,
        label: budgetLabel,
        backgroundColor: [budgetBackgroundColor],
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
          cityName: tripHotel.location_string.split(",")[0],
          airlineNames: tripFlightNameArray,
          hotelName: tripHotel.name,
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
      toggleConfirmModal();
    } else {
      toggleModal();
    }
  };

  return (
    <div>
      <Bar data={data} options={options} />
      <button onClick={handleClick}>Email</button>
      <Modal isOpen={showModal} onRequestClose={toggleModal}>
        <h2>Please Login or Sign-Up To Use This Service!</h2>
        <div>
          <Link to="/login">
            <div className="navbar-item">Login</div>
          </Link>
          <Link to="/signup">
            <div className="navbar-item">Sign Up</div>
          </Link>
        </div>
        <div>
          <button onClick={toggleModal}>Close</button>
        </div>
      </Modal>
      <Modal isOpen={showConfirmModal} onRequestClose={toggleConfirmModal}>
        <h2>E-mail Was Successfully Sent!</h2>
        <button onClick={toggleConfirmModal}>Close</button>
      </Modal>
    </div>
  );
};

export default ConfirmationPage;
