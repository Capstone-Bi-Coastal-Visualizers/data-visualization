import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
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
  if (Object.keys(tripData).length === 0) {
    return (
      <div className="container has-text-centered pt-6">
        <h2 className="title mb-6">Confirmation Page</h2>
        <div className="has-text-centered">
          <p
            className="mb-4 is-size-7-mobile	
      is-size-5-touch	
      is-size-4-tablet	
      is-size-4-desktop	
      is-size-4-widescreen	
      is-size-4-fullhd"
          >
            No trip to display. Please navigate to the home page to search for
            trips.
          </p>
          <Link to="/" className="button is-primary">
            Home Page
          </Link>
        </div>
      </div>
    );
  } else {
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
    const destinationOne = tripOneReturningFlight[2].filter((airportId) => {
      return (
        airportId.PlaceId === tripOneReturningFlight[1].OutboundLeg.OriginId
      );
    })[0].CityName;
    const destinationTwo = tripTwoReturningFlight[2].filter((airportId) => {
      return (
        airportId.PlaceId === tripTwoReturningFlight[1].OutboundLeg.OriginId
      );
    })[0].CityName;

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

    const destinationCity = tripReturningFlight[2].filter((airportId) => {
      return airportId.PlaceId === tripReturningFlight[1].OutboundLeg.OriginId;
    })[0].CityName;

    const departureDate =
      tripFirstFlight[1].OutboundLeg.DepartureDate.split("T")[0];
    const returnDate =
      tripReturningFlight[1].OutboundLeg.DepartureDate.split("T")[0];
    const nights =
      selectedTrip === 1 ? tripOneStayDuration : tripTwoStayDuration;

    const arbitraryStackKey = "stack1";

    const selectedFlights =
      selectedTrip === 1 ? tripOneFlights : tripTwoFlights;
    const selectedHotel =
      selectedTrip === 1 ? tripOneHotelCost : tripTwoHotelCost;
    const difference = budget - selectedFlights - selectedHotel;
    const budgetLabel = difference >= 0 ? "Remaining budget" : "Over budget";
    const destination = selectedTrip === 1 ? destinationOne : destinationTwo;
    const budgetBackgroundColor =
      difference > 0 ? "rgba(5, 226, 205, 0.2)" : "rgba(255, 95, 160, 0.2)";
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
          label: "Airfare $",
          backgroundColor: ["rgba(54, 162, 235, 0.2)"],
          data: [selectedFlights],
        },
        {
          stack: arbitraryStackKey,
          label: "Accommodations $",
          backgroundColor: ["rgba(255, 206, 86, 0.2)"],
          data: [selectedHotel],
        },
        {
          stack: arbitraryStackKey,
          label: `${budgetLabel} ($)`,
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
          cityName: destinationCity,
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
      <div className="container is-flex is-flex-direction-column is-justify-content-center is-align-items-center has-text-centered pt-6 box">
        <h2 className="title">Confirmation</h2>
        <div className="confirmation-page-graph">
          <Bar data={data} options={options} />
        </div>
        <table className="table mt-4 table-width">
          <thead>
            <tr>
              <th scope="col">Dep. Airport</th>
              <th scope="col">Dest. Airport</th>
              <th scope="col">Dep. Date</th>
              <th scope="col">Return Date</th>
              <th scope="col">Airline(s)</th>
              <th scope="col">Hotel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td scope="row">{departureAirport}</td>
              <td scope="row">{destinationAirport}</td>
              <td scope="row">{departureDate}</td>
              <td scope="row">{returnDate}</td>
              <td scope="row">
                {tripFlightNameArray && tripFlightNameArray.length > 1
                  ? `${tripFlightNameArray[0]}, ${tripFlightNameArray[1]}`
                  : tripFlightNameArray[0]}
              </td>
              <td scope="row">{tripHotel.name}</td>
            </tr>
          </tbody>
        </table>
        <div>
          {!token ? (
            <div className="is-size-6 mt-4 mb-4">
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
                <h3 className="is-size-6 mt-4 mb-4">
                  Your E-mail has successfully been sent!
                </h3>
              ) : (
                <button
                  className="button is-primary mt-4 mb-4 ml-3"
                  onClick={handleEmail}
                >
                  E-mail
                </button>
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
  }
};

export default ConfirmationPage;
