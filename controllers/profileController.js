const { User, Profile } = require('../models');


const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id}).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({msg: 'There is no profile with this user'});
    }
    res.json(profile);
  } catch(e) {
    console.error(e);
    res.status(500).json({msg: 'server error'})
  }
};

module.exports = { getMyProfile };