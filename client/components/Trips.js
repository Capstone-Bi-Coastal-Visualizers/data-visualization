import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserTripsHistory } from '../store/userTripsData'
//import { Pie } from 'react-chartjs-2';
import Map from './Map'

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";


// const data = {
//   labels: ['Hotel', 'Airfare', 'Savings'],
//   datasets: [
//     {
//       label: '# of Votes',
//       data: [12, 19, 3],
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.2)',
//         'rgba(54, 162, 235, 0.2)',
//         'rgba(255, 206, 86, 0.2)',
//         'rgba(75, 192, 192, 0.2)',
//         'rgba(153, 102, 255, 0.2)',
//         'rgba(255, 159, 64, 0.2)',
//       ],
//       borderColor: [
//         'rgba(255, 99, 132, 1)',
//         'rgba(54, 162, 235, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(153, 102, 255, 1)',
//         'rgba(255, 159, 64, 1)',
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const markers = [
  { markerOffset: 15, name: "Brasilia", coordinates: [-47.8825, -15.7942] },
  //{ markerOffset: 15, name: "Santiago", coordinates: [-70.6693, -33.4489] },
  { markerOffset: 15, name: "Paris", coordinates: [2.3522, 48.8566] },
  //{ markerOffset: 15, name: "Hong Kong", coordinates: [114.17, 22.31] },
  // { markerOffset: 15, name: "Vancouver", coordinates: [123.1207, 49.2827] },
  // { markerOffset: 15, name: "Havana", coordinates: [82.366, 23.1136] },
  //{ markerOffset: 15, name: "Mexico City", coordinates: [99.133, 19.4326] },
  // { markerOffset: 15, name: "Paramaribo", coordinates: [-55.2038, 5.852] },
  // { markerOffset: 15, name: "Montevideo", coordinates: [-56.1645, -34.9011] },
  // { markerOffset: 15, name: "Caracas", coordinates: [-66.9036, 10.4806] },
  // { markerOffset: 15, name: "Lima", coordinates: [-77.0428, -12.0464] }
];


const Trips = () => {
    //console.log('here is state in Trips', state)
    //useEffect is like component did mount and this needs to happen after the trips link has been pressed
    //check if user has trips, if so populate a div of trip with a link to the actual trip details
    const dispatch = useDispatch();
    useEffect(() => {
        const token = localStorage.getItem('token');
        dispatch(fetchUserTripsHistory(token))
        }, [])
    
    const tripHistory = useSelector((state) => state.userTripsReducer)
    // console.log('here is trip history', tripHistory)

return (
    <div className="trips-container">
        <h1>Trips</h1>
        <div className="trips-list">
          {tripHistory.map(trip => {
            return (
              <div className="trip-item" key={trip.id}>
                  <Link to={`/trips/${trip.id}`}>
                  <div>{trip.id}</div>
                  </Link>
              </div>
            );
          })}
        </div>
        <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{
        scale: 150
      }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies
            //.filter(d => d.properties.REGION_UN === "Asia")
            .map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
              />
            ))
        }
      </Geographies>
      {markers.map(({ name, coordinates, markerOffset }) => (
        <Marker key={name} coordinates={coordinates}>
          <g
            fill="none"
            stroke="#FF5533"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(-12, -24)"
          >
            <circle cx="12" cy="10" r="3" />
            <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
          </g>
          <text
            textAnchor="middle"
            y={markerOffset}
            style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
          >
            {name}
          </text>
        </Marker>
      ))}
    </ComposableMap>

     {/* <div className='header'>
       <h1 className='title'>Trip History Breakdown</h1>
       <div className='links'>
         <a
           className='btn btn-gh'
           href='https://github.com/reactchartjs/react-chartjs-2/blob/master/example/src/charts/Pie.js'
         >
           Github Source
         </a>
       </div>
     </div>
     <Pie data={data} /> */}
     {/* <div>
     <Map />
       </div>    */}
    </div>
)
}

export default Trips


