const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  let user = await User.findOne({username: req.body.username});
  if (user) return res.send('username already exists');

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  user = new User({
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    dob: new Date(req.body.dob),
    username: req.body.username,
    password: hashedPassword
  })
  try {
    user = await user.save();
    res.send('success');
  }
  catch (err) {
    res.send('error')
  }
});

module.exports = router;