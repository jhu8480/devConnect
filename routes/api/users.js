const router = require('express').Router();
const { validation, postUser } = require('../../controllers/userController');

// @route GET api/users
// @desc Test route
// @access Public
router.get('/', (req, res) => {
  res.json('User route');
});

router.post('/', validation, postUser);

module.exports = router;