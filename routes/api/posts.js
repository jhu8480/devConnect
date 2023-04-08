const router = require('express').Router();

// @route GET api/posts
// @desc Test route
// @access Public
router.get('/', (req, res) => {
  res.json('Posts route');
});

module.exports = router;