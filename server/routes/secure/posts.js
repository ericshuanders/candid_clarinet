const router = require('express').Router(),
  { createPost, updatePost, deletePost } = require('../../controllers/posts');

router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
