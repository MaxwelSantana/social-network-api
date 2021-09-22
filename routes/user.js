const express = require('express');
const {
    allUsers,
    userById,
    getUser,
    updateUser,
    deleteUser,
    hasAuthorization,
    userPhoto,
    addFollowing,
    addFollower,
    removeFollowing,
    removeFollower,
} = require('../controllers/user');
const { requireSign } = require('../controllers/auth');
const { postById } = require('../controllers/post');

const router = express.Router();

router.put('/users/follow', requireSign, addFollowing, addFollower);
router.put('/users/unfollow', requireSign, removeFollowing, removeFollower);

router.get('/users', allUsers);
router.get('/user/:userId', requireSign, getUser);
router.put('/user/:userId', requireSign, hasAuthorization, updateUser);
router.delete('/user/:userId', requireSign, hasAuthorization, deleteUser);
router.get('/user/photo/:userId', userPhoto);

router.param('userId', userById);

module.exports = router;
