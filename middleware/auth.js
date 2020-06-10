const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  //Get token from request header
  const token = req.header('x-auth-token'); //header key that we send the token in

  // If the token doesn't exist, the user is unauthorized
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user; //set user id equal to decoded jwt user id
    next();
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
