const express = require('express');
const {
    getPosts,
    createPost,
    postsByUser,
    isPoster,
    updatePost,
    deletePost,
    postById,
    photo,
    singlePost,
    like,
    unlike,
} = require('../controllers/post');
const { createPostValidator } = require('../validators');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

const router = express.Router();

// like unlike
router.put('/post/like', requireSignin, like);
router.put('/post/unlike', requireSignin, unlike);

router.get('/posts', getPosts);
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.post(
    '/post/new/:userId',
    requireSignin,
    createPost,
    createPostValidator,
);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);

// photo
router.get('/post/photo/:postId', photo);

router.get('/post/:postId', singlePost);

router.param('userId', userById);
router.param('postId', postById);

module.exports = router;
