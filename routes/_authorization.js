require('dotenv').config()

const jwt = require('jsonwebtoken');

function Authorization(req, res, next) {
  const accessToken = req.get('Authorization');
  if (!accessToken) return res.send({ Authorization: false });

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.send({ Authorization: false });
    req.user = user
  })
  next()
}

module.exports = Authorization;