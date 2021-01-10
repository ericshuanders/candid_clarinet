const router = require('express').Router(),
  {
    logoutUser,
    updateUser,
    uploadAvatar,
    getCurrentUser,
    deleteUser,
  } = require('../../controllers/users');

router.post('/logout', logoutUser);
router.put('/update', updateUser);
router.post('/avatar', uploadAvatar);
router.get('/me', getCurrentUser);
router.delete('/delete', deleteUser);

module.exports = router;
