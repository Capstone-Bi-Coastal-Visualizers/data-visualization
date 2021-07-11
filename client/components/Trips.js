import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserTripHistory } from '../store/userTripData'

const Trips = () => {
    //console.log('here is state in Trips', state)
    //useEffect is like component did mount and this needs to happen after the trips link has been pressed
    //check if user has trips, if so populate a div of trip with a link to the actual trip details
    const dispatch = useDispatch();
    useEffect(() => {
        const token = localStorage.getItem('token');
        dispatch(fetchUserTripHistory(token))
        }, [])
    
    const tripHistory = useSelector((state) => state.userTripReducer)
    // console.log('here is trip history', tripHistory)

return (
    <div className="trips-container">
        <h1>Trips</h1>
        <ul>
          {tripHistory.map(trip => {
            return (
              <li key={trip.id}>
                  <Link to={`/trips/detail/${trip.id}`}>
                  <div>{trip.id}</div>
                  </Link>
              </li>
            );
          })}
        </ul>

    </div>
)
}

export default Trips