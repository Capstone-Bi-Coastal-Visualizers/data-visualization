import React from "react";
import { useSelector } from "react-redux";
import BarChart from "./BarChart";

const SearchResult = (props) => {
  const state = useSelector((state) => state);
  console.log(state, "-------------------");
  // const { firstFlight, returningFlight } = state.tripDataReducer;
  // const data = {
  //   flightOne: firstFlight[1].minPrice + returningFlight[1].minPrice,
  //   flightTwo: 140.0,
  //   hotelOne: 120.58,
  //   hotelTwo: 180,
  //   budget: 300,
  //   destinationOne: "Los Angeles",
  //   destinationTwo: "New York",
  // };

  return (
    <div>
      <BarChart data={props} />
    </div>
  );
};

export default SearchResult;
