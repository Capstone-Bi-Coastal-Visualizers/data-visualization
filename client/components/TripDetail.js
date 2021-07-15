import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
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

  const leftoverBudget = trip.budget - trip.hotelCost + trip.airfareCost;

  const budgetLabel = leftoverBudget > 0 ? "Budget Deficit" : "Budget Surplus";

  const budgetBackgroundColor =
    leftoverBudget > 0 ? "rgba(255, 95, 160, 0.2)" : "rgba(5, 226, 205, 0.2)";

  const budgetBorderColor =
    leftoverBudget > 0 ? "rgba(255, 95, 160, 1)" : "rgba(5, 226, 205, 1)";

  const data = {
    labels: ["Airfare $", "Accommodations $", `${budgetLabel} $`],
    datasets: [
      {
        label: "# of Votes",
        // [hotel, airfare, savings]
        data: [trip.airfareCost, trip.hotelCost, Math.abs(leftoverBudget)],
        backgroundColor: [
          "rgba(50, 155, 220, 0.2)", // Airfare
          "rgba(255, 255, 100, 0.2)", // Hotel
          budgetBackgroundColor, // Budget
        ],
        borderColor: [
          "rgba(50, 155, 220, 1)", // Airfare border
          "rgba(255, 255, 100, 1)", // Hotel border
          budgetBorderColor, // Budget border
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container trip-detail-container has-text-centered pt-6">
      <h1 className="title">Trip Detail</h1>

      <div className="trip-detail-list box has-text-centered">
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
              <td scope="row">{trip.id}</td>
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
      <div className="box has-text-centered">
        <h2 className="title">Visualization</h2>
        <Doughnut data={data} />
      </div>
      <Link to="/trips">
        <button className="button is-primary">Back to Trips</button>
      </Link>
    </div>
  );
};

export default TripDetail;
