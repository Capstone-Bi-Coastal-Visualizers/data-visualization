const router = require("express").Router();
const {
    models: { Trip, User },
} = require("../db");

module.exports = router

const isUser = async (req, res, next) => {
    try {
      const user = await User.findByToken(req.headers.authorization);
      req.user = user;
      if (user.id) {
        next();
      } else {
        res.sendStatus(403);
      }
    } catch (error) {
      next(error);
    }
  };

router.get("/", isUser, async (req, res, next) => {
    try {
        const trips = await Trip.findAll({
            where: { 
                userId: req.user.id
            }
        })
        console.log('here are trips', trips)
        res.send(trips)
    } catch (error) {
      next(error)  
    }
});