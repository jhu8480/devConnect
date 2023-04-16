const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const { createPost, getAllPosts, getOnePost, deletePost, addLike, removeLike, postComment, removeComment } = require('../../controllers/postController');

// create post
router.post('/', [auth, [check('text', 'text is required').not().isEmpty()]], createPost);

// get all posts
router.get('/', auth, getAllPosts);

// get one post by id
router.get('/:post_id', auth, getOnePost);

// delete post by id
router.delete('/:post_id', auth, deletePost);

// add like
router.put('/like/:post_id', auth, addLike);

// remove like
router.put('/dislike/:post_id', auth, removeLike);

// post comment
router.post('/comment/:post_id', [
  auth,
  [
    check('text', 'Text is required')
      .not()
      .isEmpty()
  ]
], postComment);

router.delete('/comment/:post_id/:comment_id', auth, removeComment);

module.exports = router;