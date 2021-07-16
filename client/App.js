import React from "react";
import Routes from "./Routes";
import NavBar from "./components/NavBar"

const num = Math.floor(Math.random() * 10) + 1 
const App = () => {
  return (
    <div style={{ 
      backgroundSize: 'cover',
            overflow: 'hidden',
      // backgroundImage: `url("images/5.png")`, 
      backgroundImage: `url("images/${num}.png")` 
    }}>
    <div>
      <NavBar />
      <Routes />
    </div>
    </div>
  );
};

export default App;
