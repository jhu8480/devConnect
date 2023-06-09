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

const addLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    // check if the post has already been liked by the user
    if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({msg: 'Post already liked'});
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch(e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
}

const removeLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({msg: 'Post has not been liked yet'});
    }
    
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post);
  } catch(e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
}

const postComment = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.post_id);

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    }
    
    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);

  } catch(e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
};

const removeComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    // pull out comment
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);
    if(!comment) {
      return res.status(404).json({msg: 'comment not found'});
    }
    // check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({msg: 'unauthorized'});
    }

    const removeIndex = post.comments.map(
      comment => comment.id.toString()
    ).indexOf(req.params.comment_id);
    
    post.comments.splice(removeIndex, 1);

    res.json(post.comments);

  } catch(e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
};

module.exports = { createPost, getAllPosts, getOnePost, deletePost, addLike, removeLike, postComment, removeComment };