const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const searchRouter = require('./routes/search.js');
const bookingRouter = require('./routes/booking.js');
const userRouter = require('./routes/user.js');
const signinRouter = require('./routes/signin.js');
const signupRouter = require('./routes/signup.js');
const app = express();

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE_URI)
  .then(res => console.log("Connected to DB"))
  .catch(err => console.log(err))

app.use('/api/search', searchRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/user', userRouter);
app.use('/api/signin', signinRouter);
app.use('/api/signup', signupRouter);


app.listen(5000);