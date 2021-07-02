import React from "react";
import Navbar from "./components/Navbar";
import Routes from "./Routes";
import SearchBar from "./components/SearchBar";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
      <SearchBar />
    </div>
  );
};

// -------------------------------------------------
// Example code for stacked bar chart
// import React from "react";
// import { Bar } from "react-chartjs-2";

// const arbitraryStackKey = "stack1";

// const data = {
//   labels: ["a", "b", "c", "d", "e"],
//   datasets: [
//     // These two will be in the same stack.
//     {
//       stack: arbitraryStackKey,
//       label: "data1",
//       backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
//       data: [1, 2, 3, 4, 5],
//     },
//     {
//       stack: arbitraryStackKey,
//       label: "data2",
//       backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
//       data: [5, 4, 3, 2, 1],
//     },
//   ],
// };

// const options = {
//   scales: {
//     yAxes: [
//       {
//         stacked: true,
//         ticks: {
//           beginAtZero: true,
//         },
//       },
//     ],
//     xAxes: [
//       {
//         stacked: true,
//       },
//     ],
//   },
// };

// export default class App extends React.Component {
//   render() {
//     return (
//       <div>
//         <Bar data={data} options={options} />
//       </div>
//     );
//   }
// }

export default App;
