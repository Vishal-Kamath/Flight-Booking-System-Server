const express = require('express');
const Flight = require('../models/flight')
const router = express.Router();

router.get('/', async (req, res) => {
  let date = new Date(req.query.date);
  let time = new Date();
  let flights;

  if (time.toLocaleDateString() === date.toLocaleDateString()) {
    date.setHours(time.getHours() + 3);
    date.setMinutes(time.getMinutes());

    let endDate = new Date(req.query.date);
    endDate.setHours(23);
    endDate.setMinutes(59);

    flights = await Flight.find({
      source: req.query.source,
      destination: req.query.destination,
      startDateTime: { $gte: date, $lte: endDate}
    })

    return res.send(flights);
  }

  let startDate = new Date(req.query.date);
  startDate.setHours(0);
  startDate.setMinutes(0);

  let endDate = new Date(req.query.date);
  endDate.setHours(23);
  endDate.setMinutes(59);

  flights = await Flight.find({
    source: req.query.source,
    destination: req.query.destination,
    startDateTime: { $gte: startDate, $lte: endDate }
  })

  res.send(flights);  
});

module.exports = router;