import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserTripDetail } from '../store/userTripData'

const TripDetail = (props) => {
    //console.log('here is state in Trips', state)
    //useEffect is like component did mount and this needs to happen after the trips link has been pressed
    //check if user has trips, if so populate a div of trip with a link to the actual trip details
    const dispatch = useDispatch();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const item = props.match.params.id
        dispatch(fetchUserTripDetail(token, item))
        }, [])

    const trip = useSelector((state) => state.userTripReducer)
    console.log("here is trip in component", trip)
    
return (
    <div className="trip-detail-container">
        <h1>Trip <Link to="/trips">{trip.id}</Link> Detail</h1>
       
              <div className="trip-detail-list">
                  {/* <Link to={"/trips/"}>
                  <div>{trip.id}</div>
                  </Link> */}
                  <h2>Departure Date: {trip.departureDate}</h2>
                  <h2>Return Date: {trip.returnDate}</h2>
                  <h2>Hotel Cost: ${trip.hotelCost}.00</h2>
                  <h2>Airfare Cost: ${trip.airfareCost}.00</h2>
                  <h2>Budget: ${trip.budget}.00</h2>
                  <hr></hr>
                  <h2>Savings ${trip.budget - (trip.hotelCost + trip.airfareCost)}.00</h2>
              </div>

    </div>
)
}

export default TripDetail