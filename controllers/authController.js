const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const { User } = require('../models');


const authController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch(e) {
    console.error(e);
    res.status(500).json({msg: 'server error!'});
  }
}

const validateLogin = [
  check('email', 'Please include a valid email').isEmail(), check('password', 'password is required').exists()
];

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }
  const {email, password} = req.body;
  
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({errors: [{msg: 'invalid credentials'}]});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({errors: [{msg: 'invalid credentials'}]});
    }

    const payload = {
      user: {
        id: user.id
      }
    }
    jwt.sign(payload, config.get('jwtToken'), { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({token});
    });

  } catch(e) {
    console.error(e.message);
    res.status(500).json('Internal server error');
  }
}

module.exports = { authController, validateLogin, loginUser };