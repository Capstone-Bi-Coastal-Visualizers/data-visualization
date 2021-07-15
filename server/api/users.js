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
    const difference = hotel + airfare - budget;
    const budgetLabel = difference > 0 ? "Under Budget" : "Over Budget";
    // let transporter = nodemailer.createTransport({
    //   host: "smtp.ethereal.email",
    //   port: 587,
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: "jamal.carter@ethereal.email", // generated ethereal user
    //     pass: "AjFBqpjr7SzkzM3eVs", // generated ethereal password
    //   },
    // });

    // send mail with defined transport object
    const msg = {
      from: "bicoastalvisualizers@gmail.com", // sender address
      to: `${email}`, // list of receivers
      subject: `Details on your trip to ${destinationAirport}`, // Subject line
      html: `<div style="text-align: center;">
      <h1>Trip Details</h1>
      <ul>
      <li> Departure Airport: ${departureAirport}</li>
      <li>Destination Airport: ${destinationAirport}</li>
      <li> Departure Date: ${departureDate}</li>
      <li> Return Date: ${returnDate}</li>
      <li>${hotel}</li>
      <li>Trip Duration: ${nights} nights</li>
      <li>Airfare: $${airfare}.00</li>
      <li>Accommodations: $${hotelPrice}.00</li>
      <li>Total Expenses: $${total}.00</li>
      <li>${budgetLabel}: ${Math.abs(difference)}</li>
      </ul>
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
