const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

module.exports = function (req, res, next) {
  //Get token from request header
  const token = req.header('x-auth-token'); //header key that we send the token in

  // If the token doesn't exist, the user is unauthorized
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);

    req.user = decoded.user; //set user id equal to decoded jwt user id
    next();
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
