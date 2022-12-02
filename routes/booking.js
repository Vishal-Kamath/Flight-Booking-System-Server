const express = require('express');
const router = express.Router();
const Flight = require('../models/flight');
const Seat = require('../models/seat');
const User = require('../models/user.js');
const Booking = require('../models/booking');
const Authorization = require('./_authorization.js');

router.get('/seats', async (req, res) => {
  const seats = await Seat.find({flight_id: req.query.flight_id})
  res.send(seats)
});

router.get('/bookingDetails', Authorization, async (req, res) => {
  const bookingDetails = await Booking.find({'bookingGroupId.id': req.query.booking_id})
  res.send(bookingDetails);
})

router.get('/', async (req, res) => {
  const flight = await Flight.findOne({flight_id: req.query.flight_id})
  res.send(flight)
});


router.post('/', Authorization, async (req, res) => {
  let user = await User.findOne({ username: req.user.username});
  const coins = user.coins - (req.body.price * req.body.passengersSeatArray.length);
  if(coins < 0) return res.send({ message: 'insufficient balance'});

  let i = 0;
  let length = req.body.passengersSeatArray.length;
  for (; i < length; i++ ) {
    let seatRow = req.body.passengersSeatArray[i].slice(0, -1)
    let seatColumn = req.body.passengersSeatArray[i].slice(-1)
    let booking = new Booking({
      flight_id: req.body.flight_id,
      userId: user._id,
      bookingGroupId: {
        id: req.body.groupUUID,
        airlines: req.body.airlines,
        source: req.body.source,
        destination: req.body.destination,
        startDateTime: req.body.startDateTime,
        endDateTime: req.body.endDateTime,
        startAirport: req.body.startAirport,
        endAirport: req.body.endAirport,
      },
      passengerFirstName: req.body.passengerFirstName[i],
      passengerLastName: req.body.passengerLastName[i],
      passengerGender: req.body.passengerGender[i],
      seatRow: parseInt(seatRow),
      seatColumn: seatColumn,
      price: req.body.price
    });
  
    
    try {
      booking = await booking.save();
      let seat = await Seat.findOneAndUpdate(
        {
          flight_id: req.body.flight_id,
          seatRow: parseInt(seatRow),
          seatColumn: seatColumn
        },
        {
          status: 'Booked',
          booking_id: booking._id
        },
        (err, seat) => {
          if(err) {
            res.sendStatus(400);
            return console.log(err);
          }
        }
      ).clone();
    }
    catch (err) {
      console.log(err);
      res.sendStatus(409)
    }
  }
  user = await User.findByIdAndUpdate(
    user._id,
    {
      coins: coins
    },
    (err) => {
      if(err) return console.log(err);
    }
  ).clone()
  res.send({message: 'success'});
});

router.delete('/bookingDetails', Authorization, async (req, res) => {
  let user = req.user;
  user = await User.findOne({ username: user.username});
  if (!user) return res.send({message: 'Unauthorized'});

  let booking = await Booking.findByIdAndDelete(req.query.booking_id);
  
  user.coins = user.coins + booking.price;
  user = await User.findByIdAndUpdate(
    user._id,
    {
      coins: user.coins
    },
    (err) => {
      if(err) return console.log(err);
    }
  ).clone()

  let seat = await Seat.findOneAndUpdate(
    {
      flight_id: booking.flight_id,
      seatRow: parseInt(booking.seatRow),
      seatColumn: booking.seatColumn
    },
    {
      status: 'Active',
      booking_id: 'None'
    },
    (err, seat) => {
      if(err) {
        res.sendStatus(400);
        return console.log(err);
      }
    }
  ).clone()

  res.send({message: 'successful'})
})



module.exports = router;