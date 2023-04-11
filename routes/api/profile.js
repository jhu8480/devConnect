const router = require('express').Router();
const auth = require('../../middleware/auth');
const { getMyProfile } = require('../../controllers/profileController');

// @route GET api/profile/me
// @desc Get current user's profile
// @access Private
router.get('/me', auth, getMyProfile);

module.exports = router;