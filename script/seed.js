"use strict";

const {
  db,
  models: { User, Trip },
} = require("../server/db");

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log("db synced!");

  // Creating Users
  const users = await Promise.all([
    User.create({
      firstName: "cody",
      lastName: "last",
      email: "cody@gmail.com",
      password: "123",
    }),
  ]);

  //Create trip

  const trips = await Promise.all([
    Trip.create({
      originAirport: "LAX",
      destinationAirport: "JFK",
      departureDate: "2021-07-01",
      returnDate: "2021-07-07",
      airfareCost: 199,
      hotelCost: 200,
      budget: 600,
      destCoordinates: [40.6413, -73.7781],
      cityName: "New York",
      hotelName: "Hilton",
      airlineNames: ["Delta Airlines"],
      userId: 1,
    }),
    Trip.create({
      originAirport: "LAX",
      destinationAirport: "LHR",
      departureDate: "2021-07-10",
      returnDate: "2021-07-15",
      airfareCost: 400,
      hotelCost: 200,
      budget: 300,
      destCoordinates: [51.5074, 0.1278],
      cityName: "London",
      hotelName: "Claridges",
      airlineNames: ["Delta Airlines", "United Airlines"],
      userId: 1,
    }),
    Trip.create({
      originAirport: "LAX",
      destinationAirport: "GIG",
      departureDate: "2021-07-20",
      returnDate: "2021-07-24",
      airfareCost: 400,
      hotelCost: 200,
      budget: 300,
      destCoordinates: [-22.908333, -43.196388],
      cityName: "Rio de Janiero",
      hotelName: "Ritz Carlton",
      airlineNames: ["United Airlines"],
      userId: 1,
    }),
    Trip.create({
      originAirport: "LAX",
      destinationAirport: "HND",
      departureDate: "2021-07-25",
      returnDate: "2021-07-29",
      airfareCost: 500,
      hotelCost: 200,
      budget: 600,
      destCoordinates: [35.652832, 139.839478],
      cityName: "Tokyo",
      hotelName: "Ritz Carlton",
      airlineNames: ["United Airlines"],
      userId: 1,
    }),
    Trip.create({
      originAirport: "LAX",
      destinationAirport: "BLR",
      departureDate: "2021-08-01",
      returnDate: "2021-08-10",
      airfareCost: 800,
      hotelCost: 300,
      budget: 600,
      destCoordinates: [12.971891, 77.641151],
      cityName: "Bangalore",
      hotelName: "Hilton",
      airlineNames: ["Delta Airlines"],
      userId: 1,
    }),
    Trip.create({
      originAirport: "LAX",
      destinationAirport: "CAI",
      departureDate: "2021-08-11",
      returnDate: "2021-08-20",
      airfareCost: 800,
      hotelCost: 300,
      budget: 600,
      destCoordinates: [30.033333, 31.233334],
      cityName: "Cairo",
      hotelName: "Hilton",
      airlineNames: ["Delta Airlines"],
      userId: 1,
    }),
  ]);

  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
  return {
    users: {
      cody: users[0],
      murphy: users[1],
    },
  };
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
