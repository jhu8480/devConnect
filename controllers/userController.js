const { User } = require('./../models');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');


const validation = [
  check('name', 'Name is required').not().isEmpty(), 
  check('email', 'Please include a valid email').isEmail(), check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
];

const postUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }
  const {name, email, password} = req.body;
  
  try {
    // check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({errors: [{msg: 'user alreay exists!'}]});
    }
    // Get user gravatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

    user = new User({
      name,
      email,
      password,
      avatar
    });

    console.log(avatar);

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    //Return jasonwebtoken
    const payload = {
      user: {
        id: user.id
      }
    }
    jwt.sign(payload, config.get('jwtToken'), { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({token});
    })

  } catch(e) {
    console.error(e.message);
    res.status(500).json('Internal server error');
  }
}

module.exports = { validation, postUser };