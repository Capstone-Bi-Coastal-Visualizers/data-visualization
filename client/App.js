import React from "react";
import Routes from "./Routes";
import SearchBar from "./components/SearchBar";
import BarChart from "./components/BarChart";
import NavBarTwo from "./components/NavBarTwo"

const App = () => {
  return (
    <div>
      <NavBarTwo />
      <Routes />
      <SearchBar />
      <BarChart
        data={{
          flightOne: 120.51,
          flightTwo: 140.0,
          hotelOne: 120.58,
          hotelTwo: 180,
          budget: 300,
          destinationOne: "Los Angeles",
          destinationTwo: "New York",
        }}
      />
    </div>
  );
};

export default App;
