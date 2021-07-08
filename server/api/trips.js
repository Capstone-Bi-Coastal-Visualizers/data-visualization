const router = require("express").Router();
const {
    models: { Trip, User },
} = require("../db");

module.exports = router

router.get("/", async (req, res, next) => {
    try {
        const user = await User.findByToken(req.headers.authorization)
        console.log("here is user", user)
        const trips = await Trip.findAll({
            where: { 
                userId: user.id
            }
        })
        res.send(trips)
    } catch (error) {
      next(error)  
    }
});