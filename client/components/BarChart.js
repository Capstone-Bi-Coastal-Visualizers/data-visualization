// import React from "react";
// import { Bar } from "react-chartjs-2";

// const BarChart = (props) => {
//   const arbitraryStackKey = "stack1";
//   const {
//     flightOne,
//     flightTwo,
//     hotelOne,
//     hotelTwo,
//     budget,
//     destinationOne,
//     destinationTwo,
//   } = props.data;

//   const differenceOne = budget - flightOne - hotelOne;
//   const differenceTwo = budget - flightTwo - hotelTwo;
//   const data = {
//     labels: [destinationOne, destinationTwo],
//     datasets: [
//       // These two will be in the same stack.
//       {
//         stack: arbitraryStackKey,
//         label: "Flight",
//         backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
//         data: [flightOne, flightTwo],
//       },
//       {
//         stack: arbitraryStackKey,
//         label: "Hotel",
//         backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
//         data: [hotelOne, hotelTwo],
//       },
//       {
//         stack: arbitraryStackKey,
//         label: "Budget",
//         backgroundColor: ["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.2)"],
//         data: [differenceOne, differenceTwo],
//       },
//     ],
//   };

//   // function currency(label) {
//   //   console.log(label);
//   //   return "$" + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   // }

//   const options = {
//     // scaleLabel: currency(80),
//     scales: {
//       yAxes: [
//         {
//           stacked: true,
//           ticks: {
//             beginAtZero: true,
//           },
//         },
//       ],
//       xAxes: [
//         {
//           stacked: true,
//         },
//       ],
//     },
//   };

//   return (
//     <div>
//       <Bar data={data} options={options} />
//       <h2>{destinationOne}</h2>
//       <h3>
//         {differenceOne > 0
//           ? `Under budget by $${differenceOne.toFixed(2)}`
//           : `Over budget by $${Math.abs(differenceOne).toFixed(2)}`}
//       </h3>
//       <h2>{destinationTwo}</h2>
//       <h3>
//         {differenceTwo > 0
//           ? `Under budget by $${differenceTwo.toFixed(2)}`
//           : `Over budget by $${Math.abs(differenceTwo).toFixed(2)}`}
//       </h3>
//       <h2>
//         Cheaper to travel to:{" "}
//         {differenceOne > differenceTwo ? destinationOne : destinationTwo}
//       </h2>
//     </div>
//   );
// };

// export default BarChart;
