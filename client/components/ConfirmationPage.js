import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { toggleModal, modalContent } from "../store/auth";
import { Login, Signup } from "./AuthForm";

const ConfirmationPage = () => {
  const [emailConfirm, setEmailConfirm] = useState(false);

  const auth = useSelector((state) => state.auth);

  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const handleFormModal = (displayName) => {
    dispatch(toggleModal());
    dispatch(modalContent(displayName));
  };
  const resetDisplayName = () => {
    dispatch(toggleModal());
    dispatch(modalContent(""));
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

  const handleEmail = async () => {
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
    setEmailConfirm(true);
  };

  return (
    <div>
      <Bar data={data} options={options} />
      <div>
        {!token ? (
          <div>
            <h2>
              If you would like to E-mail flight itinirary to yourself please{" "}
              <span>
                <a onClick={() => handleFormModal("Login")}>Login </a>
              </span>
              or
              <span>
                <a onClick={() => handleFormModal("Signup")}> Sign-Up</a>
              </span>
            </h2>
          </div>
        ) : (
          <div>
            {emailConfirm ? (
              <h2>Your E-mail has successfully been sent!</h2>
            ) : (
              <button onClick={handleEmail}>E-mail</button>
            )}
          </div>
        )}
      </div>
      <div className={`modal ${auth.showModal ? "is-active" : ""}`}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <div>{auth.displayName === "Login" ? <Login /> : <Signup />}</div>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={resetDisplayName}
        ></button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
