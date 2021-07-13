import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserTripDetail } from "../store/userTripData";

const TripDetail = (props) => {
  //console.log('here is state in Trips', state)
  //useEffect is like component did mount and this needs to happen after the trips link has been pressed
  //check if user has trips, if so populate a div of trip with a link to the actual trip details
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const item = props.match.params.id;
    dispatch(fetchUserTripDetail(token, item));
  }, []);

  const trip = useSelector((state) => state.userTripReducer);
  console.log("here is trip in component", trip);

  return (
    <div className="trip-detail-container">
      <h1 className="title">Trip Detail</h1>

      <div className="trip-detail-list">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Trip ID</th>
              <th scope="col">Destination</th>
              <th scope="col">Departure Date</th>
              <th scope="col">Return Date</th>
              <th scope="col">Airline(s)</th>
              <th scope="col">Hotel</th>
              <th scope="col">Airfare</th>
              <th scope="col">Hotel Cost</th>
              <th scope="col">Budget</th>
            </tr>
          </thead>
          <tbody>
            <tr key={trip.id}>
              <tr scope="row">{trip.id}</tr>
              <td scope="row">{trip.cityName}</td>
              <td scope="row">{trip.departureDate}</td>
              <td scope="row">{trip.returnDate}</td>
              <td scope="row">
                {trip.airlineNames && trip.airlineNames.length > 1
                  ? `${trip.airlineNames[0]}, ${trip.airlineNames[1]}`
                  : trip.airlineNames}
              </td>
              <td scope="row">{trip.hotelName}</td>
              <td scope="row">
                ${trip.airfareCost ? trip.airfareCost.toFixed(2) : ""}
              </td>
              <td scope="row">
                ${trip.hotelCost ? trip.hotelCost.toFixed(2) : ""}
              </td>
              <td scope="row">${trip.budget ? trip.budget.toFixed(2) : ""}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Link to="/trips">
        <button className="button">Back to Trips</button>
      </Link>
    </div>
  );
};

export default TripDetail;
