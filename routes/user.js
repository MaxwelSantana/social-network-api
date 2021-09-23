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
    findPeople,
} = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');
const { postById } = require('../controllers/post');

const router = express.Router();

router.put('/user/follow', requireSignin, addFollowing, addFollower);
router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower);

router.get('/users', allUsers);
router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, hasAuthorization, updateUser);
router.delete('/user/:userId', requireSignin, hasAuthorization, deleteUser);
router.get('/user/photo/:userId', userPhoto);

// who to follow
router.get('/user/findpeople/:userId', requireSignin, findPeople);

router.param('userId', userById);

module.exports = router;
