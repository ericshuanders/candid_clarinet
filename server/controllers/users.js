const User = require('../db/models/user');
const Post = require('../db/models/post');
const Comment = require('../db/models/comment');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

const isEmpty = value => {
  return !value;
};

//Create a new user//

exports.createUser = async (req, res) => {
  let {
    firstName,
    lastName,
    userName,
    agreeToTerms,
    email,
    password,
  } = req.body;

  const toBoolean = string => (string === 'True' ? true : false);
  agreeToTerms = toBoolean(agreeToTerms);
  try {
    const user = new User({
      firstName,
      lastName,
      userName,
      agreeToTerms,
      email,
      password,
    });

    const token = await user.generateAuthToken();

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV !== 'production' ? false : true,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Login User//

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV !== 'production' ? false : true,
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

////////////////////////FOR SECURE ROUTES///////////////////

//Get Current User//

exports.getCurrentUser = async (req, res) => {
  try {
    // await req.user.populate('posts').populate('comments').execPopulate();
    await req.user.populate('posts').populate('comments').execPopulate();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Logout Current User//

exports.logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.cookies.jwt;
    });
    await req.user.save();
    res.clearCookie('jwt');
    res.json({ message: 'User has been logged out' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Update Current User//

exports.updateUser = async (req, res) => {
  const updates = Object.keys(req.body).filter(
    update => !isEmpty(req.body[update])
  );
  const allowedUpdates = [
    'firstName',
    'lastName',
    'userName',
    'email',
    'password',
    'avatar',
  ];
  const isValid = updates.every(update => allowedUpdates.includes(update));

  if (!isValid) return res.status(400).json({ error: 'Update not possible' });

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Upload Avatar//

exports.uploadAvatar = async (req, res) => {
  try {
    const response = await cloudinary.uploader.upload(
      req.files.avatar.tempFilePath
    );
  } catch (error) {}
};

//Delete User//

exports.deleteUser = async (req, res) => {
  try {
    await req.user.remove();
    res.clearCookie('jwt');
    res.json({ message: 'user deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
