const router = require('express').Router();
const { createUser, loginUser } = require('../../controllers/users');
const { getSpecificPost, getAllPosts } = require('../../controllers/posts');

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/:id', getSpecificPost);
router.get('/', getAllPosts);

module.exports = router;
