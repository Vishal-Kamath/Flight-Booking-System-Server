const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Booking = require('../models/booking.js')
const Authorization = require('./_authorization.js')

router.get('/',Authorization, async (req, res) => {
  const user = await User.findOne({username: req.user.username});
  if (!user) return res.send({ Authorization: false });

  const bookingDetails = await Booking.find({ userId: user._id})
    .distinct('bookingGroupId')
  res.send({ 
    Authorization: true, 
    user: user,
    bookingDetails: bookingDetails
  });
});

module.exports = router;