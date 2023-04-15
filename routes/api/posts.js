const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const { createPost } = require('../../controllers/postController');

// @route GET api/posts
// @desc Test route
// @access Public
router.post('/', [auth, [check('text', 'text is required').not().isEmpty()]], createPost);

module.exports = router;