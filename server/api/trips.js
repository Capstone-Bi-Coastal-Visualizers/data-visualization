const router = require("express").Router();
const {
  models: { Trip, User },
} = require("../db");

const isUser = require("./isUser");

module.exports = router;

router.get("/", isUser, async (req, res, next) => {
  try {
    const trips = await Trip.findAll({
      where: {
        userId: req.user.id,
      },
    });
    res.send(trips);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = await User.findByToken(token);
    const data = { ...req.body, userId: user.id };
    const trip = await Trip.create(data);
    res.json(trip);
  } catch (error) {
    next(error);
  }
});
