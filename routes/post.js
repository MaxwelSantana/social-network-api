const express = require('express');
const {
    getPosts,
    createPost,
    postsByUser,
    isPoster,
    updatePost,
    deletePost,
    postById,
} = require('../controllers/post');
const { createPostValidator } = require('../validators');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

const router = express.Router();

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

router.param('userId', userById);
router.param('postId', postById);

module.exports = router;
