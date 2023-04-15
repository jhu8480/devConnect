const { User, Profile, Post } = require('../models');
const { check, validationResult } = require('express-validator');

const createPost = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  try {
    const user = await User.findById(req.user.id).select('-password');

    const newPost = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    }
    
    const post = await Post.create(newPost);
    res.json(post);
  } catch(e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
};

module.exports = { createPost };