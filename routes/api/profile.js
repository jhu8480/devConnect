const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const { getMyProfile, createOrUpdateProfile, getAllProfiles, getProfileByUserId, deleteUserProfilePosts, addExperience, deleteExperience } = require('../../controllers/profileController');

// @route GET api/profile/me
// @desc Get current user's profile
// @access Private
router.get('/me', auth, getMyProfile);


// Get all profiles / public
router.get('/', getAllProfiles);
router.get('/user/:user_id', getProfileByUserId);


router.post('/', [auth, [
  check('status', 'status is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty()
]], createOrUpdateProfile);

router.put('/experience', auth, addExperience)
router.delete('/experience/:exp_id', auth, deleteExperience);

router.delete('/', [auth, [check('Title', 'Title is required').not().isEmpty(), check('company', 'Company is required').not().isEmpty(), check('from', 'From date is required').not().isEmpty()]], deleteUserProfilePosts);

module.exports = router;