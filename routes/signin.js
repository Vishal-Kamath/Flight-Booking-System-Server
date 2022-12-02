require('dotenv').config()

const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
  let user = await User.findOne({ username: req.body.username })
  if (!user) 
    return res.send({ message: 'Invalid username or password' });

  if (!(await bcrypt.compare(req.body.password, user.password)))
    return res.send({ message: 'Invalid username or password' });

  const userObject = {username: user.username}
  const accessToken = jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30d' })
  
  res.send({ message: 'success', accessToken: accessToken})
});

module.exports = router;