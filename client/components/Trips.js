import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserTripHistory } from '../store/userTripData'

//useEffect is like component did mount

const Trips = () => {
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    dispatch(fetchUserTripHistory(token))
    // console.log("here are props", props)

return (
    <div className="trips-container">
        <h1>Trips</h1>
        
    </div>
)
}

export default Trips