import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserTripsHistory } from "../store/userTripsData";
import { Pie } from "react-chartjs-2";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const Trips = () => {
  //console.log('here is state in Trips', state)
  //useEffect is like component did mount and this needs to happen after the trips link has been pressed
  //check if user has trips, if so populate a div of trip with a link to the actual trip details
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(fetchUserTripsHistory(token));
  }, []);

  const tripHistory = useSelector((state) => state.userTripsReducer);
  // console.log("here is trip history", tripHistory);
  // Ex. for markerArray { markerOffset: 15, name: "Brasilia", coordinates: [-47.8825, -15.7942] },
  const markers = tripHistory.map((trip) => {
    return {
      markerOffset: 15,
      name: trip.cityName,
      coordinates: [trip.destCoordinates[1], trip.destCoordinates[0]],
    };
  });
  const hotelTotalCost = tripHistory.reduce((accumulator, current) => {
    return accumulator + current.hotelCost;
  }, 0);

  const airfareTotalCost = tripHistory.reduce((accumulator, current) => {
    return accumulator + current.airfareCost;
  }, 0);

  const totalBudget = tripHistory.reduce((accumulator, current) => {
    return accumulator + current.budget;
  }, 0);
  const leftOverBudget = totalBudget - airfareTotalCost - hotelTotalCost;

  const budgetLabel =
    hotelTotalCost + airfareTotalCost > totalBudget
      ? "Budget Deficit"
      : "Budget Surplus";

  const budgetBackgroundColor =
    hotelTotalCost + airfareTotalCost > totalBudget
      ? "rgba(255, 95, 160, 0.2)"
      : "rgba(5, 226, 205, 0.2)";

  const budgetBorderColor =
    hotelTotalCost + airfareTotalCost > totalBudget
      ? "rgba(255, 95, 160, 0.2)"
      : "rgba(5, 226, 205, 1)";

  const data = {
    labels: ["Airfare $", "Accommodations $", `${budgetLabel} $`],
    datasets: [
      {
        label: "# of Votes",
        // [hotel, airfare, savings]
        data: [airfareTotalCost, hotelTotalCost, Math.abs(leftOverBudget)],
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)", // Airfare
          "rgba(255, 206, 86, 0.2)", // Hotel
          budgetBackgroundColor, // Budget
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)", // Airfare border
          "rgba(255, 206, 86, 1)", // Hotel border
          budgetBorderColor, // Budget border
        ],
        borderWidth: 1,
      },
    ],
  };
  // TODO Place map under row that contains the table and pie chart
  return (
    <div className="trips-container container has-text-centered pt-6">
      <h1 className="title">Trip History</h1>
      <div className="trip-history-pie-container mt-5">
        <div className="trips-list has-text-centered box">
          <h2 className="title">Details</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Trip #</th>
                <th scope="col">Destination</th>
                <th scope="col">Departure Date</th>
                <th scope="col">Return Date</th>
              </tr>
            </thead>
            <tbody>
              {tripHistory.map((trip, idx) => {
                return (
                  <tr key={trip.id}>
                    <th scope="row">
                      <Link to={`/trips/${trip.id}`}>{idx + 1}</Link>
                    </th>
                    <td scope="row">{trip.cityName}</td>
                    <td scope="row">{trip.departureDate}</td>
                    <td scope="row">{trip.returnDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="pie-chart box">
          <h2 className="title">Total Cost Analysis</h2>
          <Pie data={data} />
        </div>
      </div>
      <div className="map-chart mt-5">
        <h1 className="title">Cities Visited</h1>
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            scale: 200,
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies
                //.filter(d => d.properties.REGION_UN === "Asia")
                .map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#EAEAEC"
                    stroke="#D6D6DA"
                  />
                ))
            }
          </Geographies>
          {markers.map(({ name, coordinates, markerOffset }, idx) => (
            <Marker key={idx} coordinates={coordinates}>
              <g fill="#3273DC">
                <circle r="3" />
              </g>
              <text
                textAnchor="middle"
                y={markerOffset}
                style={{
                  fontFamily: "system-ui",
                  fill: "#5D5A6D",
                  fontSize: "8pt",
                }}
              >
                {name}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
};

export default Trips;
