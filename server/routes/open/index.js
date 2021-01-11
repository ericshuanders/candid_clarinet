const router = require('express').Router();
const { createUser, loginUser } = require('../../controllers/users');
const { getSpecificPost, getAllPosts } = require('../../controllers/posts');
const { createComment } = require('../../controllers/comments');
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/:id', getSpecificPost);
router.get('/', getAllPosts);
router.post('/:id', createComment);

module.exports = router;
