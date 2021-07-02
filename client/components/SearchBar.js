import React, { useState } from 'react'

export default function SearchBar() {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [budget, setBudget] = useState('');

    return (
        <div>
            <input type="text" placeholder="origin" name="origin" required value={origin} onChange={(event) => {setOrigin(event.target.value)}}/>
            <input type="text" placeholder="destination" name="destination" required value={destination} onChange={(event) => {setDestination(event.target.value)}}/>
            <input type="date" placeholder="departure date" name="departureDate" required value={departureDate} onChange={(event) => {setDepartureDate(event.target.value)}}/>
            <input type="date" placeholder="return date" name="returnDate" required value={returnDate} onChange={(event) => {setReturnDate(event.target.value)}}/>
            <input type="text" placeholder="budget" name="budget" required value={budget} onChange={(event) => {setBudget(event.target.value)}}/>
          <button onClick={fetchTripData}>Submit</button>
        </div>
    )
}