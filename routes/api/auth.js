const router = require('express').Router();
const auth = require('../../middleware/auth');
const { authController, validateLogin, loginUser } = require('../../controllers/authController');

// @route GET api/auth
// @desc Test route
// @access Public
router.get('/', auth, authController);
router.post('/', validateLogin, loginUser);

module.exports = router;