const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  //Get token from header
  const token = req.header('x-auth-token');
  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'no token, authorization denied'});
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtToken'));
    
    req.user = decoded.user;
    next();
  } catch(e) {
    res.status(401).json({msg: 'Token is not valid'});
  }
};