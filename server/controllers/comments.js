const Post = require('../db/models/post');
const Comment = require('../db/models/comment');

exports.createComment = async (req, res) => {
  try {
    const comment = await new Comment({
      ...req.body,
      post: req.params.id,
    });
    await comment.save();
    console.log(comment);
    let post = await Post.findOne({ _id: req.params.id });
    post.comments = post.comments.concat(comment._id);
    await post.save();
    res.status(200).send(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
