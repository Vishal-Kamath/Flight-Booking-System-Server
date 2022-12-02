const mongoose = require('mongoose');
const Flight = require('./models/flight')
mongoose.connect('mongodb://localhost/FBS');

async function generate(i) {
  let flight = new Flight({
    source: 'Mumbai',
    destination: 'Pune',
    startDateTime: new Date('Tue Nov 29 2022 15:45:00 GMT+0530 (India Standard Time)'),
    endDateTime: new Date('Tue Nov 29 2022 16:45:00 GMT+0530 (India Standard Time)'),
    startAirport: 'CSMT',
    endAirport: 'Pune Airport',
    price: 100,
    airlines: 'IndiGo'
  })
  
  try {
    flight = await flight.save();
    console.log(flight)
  } 
  catch (err) {
    console.log(err)
  }
}

for (let i = 0; i < 2; i++) {
  generate()
}