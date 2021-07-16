const router = require("express").Router();
const {
  models: { User },
} = require("../db");
const nodemailer = require("nodemailer");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ["id", "email"],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post("/email", async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization);
    const email = user.email;
    const {
      departureAirport,
      departureDate,
      destinationAirport,
      returnDate,
      hotel,
      nights,
      airfare,
      hotelPrice,
      total,
      budget,
    } = req.body;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bicoastalvisualizers@gmail.com",
        pass: "group5capstone",
      },
    });
    const difference = hotelPrice + airfare - budget;
    const budgetLabel = difference > 0 ? "Under Budget" : "Over Budget";

    // send mail with defined transport object
    const msg = {
      from: "bicoastalvisualizers@gmail.com", // sender address
      to: `${email}`, // list of receivers
      subject: `Details on your trip to ${destinationAirport}`, // Subject line
      html: `<div>
        <h1><span style="color: #000000;"><strong>Trip Details</strong></span></h1>
        <h2><span style="color: #000000;"><strong>${departureAirport} to&nbsp;${destinationAirport}</strong></span></h2>
        <div><span style="color: #7e8c8d;">Depart: ${departureDate} |&nbsp;Return Date: ${returnDate}</span></div>
        <div><span style="color: #7e8c8d;">Airfare: $${airfare}.00</span></div>
        <div><span style="color: #7e8c8d;">Hotel Accommodations: $${hotelPrice}.00</span></div>
        <div><span style="color: #7e8c8d;">Total Expenses: $${total}.00</span></div>
        <div>&nbsp;</div>
        <div><span style="color: #000000;"><strong>${budgetLabel}: $${Math.abs(difference)}.00</strong></span></div>
        <div>&nbsp;</div>
      </div>`, // plain text body
    };

    const info = await transporter.sendMail(msg, function (err, data) {
      if (err) {
        console.log("An Error Occured", err);
      } else {
        console.log("Email Was Sent!");
      }
    });

    // console.log("Message sent: %s", info.messageId);
    // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    res.send("Email sent!");
  } catch (error) {
    next(error);
  }
});
