const Post = require('../db/models/post');
const mongoose = require('mongoose');

exports.createPost = async (req, res) => {
  try {
    const post = await new Post({
      ...req.body,
      author: req.user._id,
    });
    await post.save();
    let user = req.user;
    user.posts = user.posts.concat(post._id);
    await user.save();
    res.status(200).send(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Get specific post//
exports.getSpecificPost = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).send('Not a valid post ');
  try {
    const post = await Post.findOne({ _id: _id });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
};

//Get all posts in database//

exports.getAllPosts = async (__, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Update post//
exports.updatePost = async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!post) return res.status(404).json({ error: 'post not found' });
    updates.forEach(update => (post[update] = req.body[update]));
    await post.save();
    res.json(post);
  } catch (e) {
    res.status(400).json({ error: e.toString() });
  }
};

//Delete Post//

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!post) return res.status(404).json({ error: 'No such post found' });
    res.status(200).json({ message: 'Post has been deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
