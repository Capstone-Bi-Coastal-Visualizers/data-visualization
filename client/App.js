import React from "react";
import Routes from "./Routes";
import NavBar from "./components/NavBar"

const App = () => {
  return (
    <div style={{ 
      backgroundSize: 'cover',
            overflow: 'hidden',
      backgroundImage: `url("images/5.png")` 
    }}>
    <div>
      <NavBar />
      <Routes />
    </div>
    </div>
  );
};

export default App;
