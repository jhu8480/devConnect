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

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({date: -1});
    res.json(posts);
  } catch(e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
};

const getOnePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if(!post) return res.status(404).json({msg: 'Post Not Found'});
    res.json(post);
  } catch(e) {
    console.error(e);
    if(e.kind === 'ObjectId') return res.status(404).json({msg: 'Post Not Found'});
    res.status(500).json('Internal server error');
  }
};

const deletePost = async (req, res) => {
  try {
    const response = await Post.findOneAndDelete({_id: req.params.post_id, user: req.user.id});
    if (!response) return res.status(404).json('Post Not Found');
    res.json(response);
  } catch(e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
}

module.exports = { createPost, getAllPosts, getOnePost, deletePost };