import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserTripHistory } from '../store/userTripData'

const Trips = (props) => {
    console.log('here are props in Trips', props)
    const dispatch = useDispatch();
    //useEffect is like component did mount and this needs to happen after the trips link has been pressed
    //check if user has trips, if so populate a div of trip with a link to the actual trip confirmation
    const token = localStorage.getItem('token');
    dispatch(fetchUserTripHistory(token))

return (
    <div className="trips-container">
        <h1>Trips</h1>
    </div>
)
}

export default Trips