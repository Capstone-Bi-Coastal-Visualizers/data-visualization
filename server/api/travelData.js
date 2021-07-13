const router = require("express").Router();
const axios = require("axios");

//GET /api/travelData/flight
router.get("/flight", async (req, res, next) => {
  try {
    let { origin, destination, flightDate } = req.query;

    const sessionConfig = {
      headers: {
        "x-rapidapi-key": process.env["FLIGHT_API_KEY"],
        "x-rapidapi-host":
          "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      },
    };

    const { data: flightSession } = await axios.get(
      `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${origin}/${destination}/${flightDate}`,
      sessionConfig
    );
    const bestFlight = [
      flightSession.Carriers[0],
      flightSession.Quotes[0],
      flightSession.Places,
    ];
    res.json(bestFlight);
  } catch (error) {
    next(error);
  }
});

router.get("/hotel", async (req, res, next) => {
  try {
    const { lon, lat, departureDate } = req.query;
    console.log(lon, lat);
    const options = {
      params: {
        latitude: lat,
        longitude: lon,
        lang: "en_US",
        hotel_class: "1,2,3",
        limit: "30",
        adults: "1",
        rooms: "1",
        currency: "USD",
        checkin: departureDate,
        nights: "4",
      },
      headers: {
        "x-rapidapi-key": process.env["HOTEL_API_KEY"],
        "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
      },
    };
    const { data: hotelData } = await axios.get(
      "https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng",
      options
    );

    let minPrice = 9999;
    let bestHotel = {};
    hotelData.data.forEach((hotel) => {
      if (hotel.price) {
        let currPrice = Number(hotel.price.split(" ")[0].split("$")[1]);
        if (currPrice < minPrice) {
          minPrice = currPrice;
          bestHotel = hotel;
        }
      }
    });

    res.json(bestHotel);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
