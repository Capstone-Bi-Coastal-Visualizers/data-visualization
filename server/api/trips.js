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

router.get("/:id", isUser, async (req, res, next) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    res.send(trip);
  } catch (error) {
    next(error);
  }
});

router.post("/", isUser, async (req, res, next) => {
  try {
    console.log(req.body, "---------------------------------------");
    const data = { ...req.body, userId: req.user.id };
    const trip = await Trip.create(data);
    res.json(trip);
  } catch (error) {
    next(error);
  }
});
