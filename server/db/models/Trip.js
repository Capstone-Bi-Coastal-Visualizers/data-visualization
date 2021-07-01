const Sequelize = require("sequelize");
const db = require("../db");

const Trip = db.define("trip", {
  originAirport: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  destinationAirport: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  departureDate: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  returnDate: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  airfairCost: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  hotelCost: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  budget: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  destCoordinates: {
    type: Sequelize.ARRAY(Sequelize.DECIMAL),
    allowNull: false,
  },
});

module.exports = Trip;
