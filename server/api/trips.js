const router = require("express").Router();
const {
  models: { Trip, User },
} = require("../db");

module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization);
    console.log("here is user", user);
    const trips = await Trip.findAll({
      where: {
        userId: user.id,
      },
    });
    res.send(trips);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    console.log("within trips route", req.body, req.headers);
    const token = req.headers.authorization;
    const user = await User.findByToken(token);

    const trip = await Trip.create(req.body);
    res.json(trip);
  } catch (error) {
    next(error);
  }
});
