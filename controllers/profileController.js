const { User, Profile } = require('../models');
const { check, validationResult } = require('express-validator');
const config = require('config');
const request = require('request');


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

// post profile
// api/profile
// create or update a user profile

const createOrUpdateProfile = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors:  errors.array()});
  }
  try {
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    // build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    let profile = await Profile.findOne({user: req.user.id});
    if (profile) {
      //update
      profile = await Profile.findOneAndUpdate({user: req.user.id}, 
        {$set: profileFields},
        {new: true});
      return res.json(profile);
    }
    
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch(e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
};

const getAllProfiles = async (req, res) => {
  try { 
    const  profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch(e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
}

const getProfileByUserId = async (req, res) => {
  try { 
    const  profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
    if (!profile) return res.status(400).json({msg: 'There is no profile for this user'})
    res.json(profile);
  } catch(e) {
    console.error(e);
    if(e.kind === 'ObjectId') {
      return res.status(400).json({msg: 'Profile not found'});
    }
    res.status(500).json('Internal server error');
  }
}

const deleteUserProfilePosts = async (req, res) => {
  try {
    //TODO: remove related posts

    // remove profile
    await Profile.findOneAndRemove({user: req.user.id});
    // remove user
    await User.findOneAndRemove({_id: req.user.id});
    res.json({msg: 'User deleted!'})
  } catch(e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
};

const addExperience = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  try {
    const profile = await Profile.findOne({user: req.user.id});
    profile.experience.unshift(newExp);
    await profile.save();
    res.json(profile);
  } catch(e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
};

const deleteExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});
    // get remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch(e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
}

const addEducation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }

  try {
    const profile = await Profile.findOne({user: req.user.id});
    profile.education.unshift(newEdu);
    await profile.save();
    res.json(profile);
  } catch(e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
};

const removeEducation = async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});
    // get remove index
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch(e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
};

const getUserRepos = async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: {'user-agent': 'node.js'}
    };
    
    request(options, (error, response, body) => {
      if(error) {
        console.error(e);
      }
      if (response.statusCode !== 200) {
        return res.status(404).json('User not found');
      }
      res.json(JSON.parse(body));
    })
  
  } catch(e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
};

module.exports = { getMyProfile, createOrUpdateProfile, getAllProfiles, getProfileByUserId, deleteUserProfilePosts, addExperience, deleteExperience, addEducation, removeEducation, getUserRepos };