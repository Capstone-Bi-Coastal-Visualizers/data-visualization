import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserTripsHistory } from '../store/userTripsData'
//import { Pie } from 'react-chartjs-2';


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
        <ul>
          {tripHistory.map(trip => {
            return (
              <li key={trip.id}>
                  <Link to={`/trips/${trip.id}`}>
                  <div>000{trip.id}</div>
                  </Link>
              </li>
            );
          })}
        </ul>

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
        

    </div>
)
}

export default Trips


