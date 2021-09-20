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
const { requireSign } = require('../controllers/auth');
const { userById } = require('../controllers/user');

const router = express.Router();

router.get('/posts', getPosts);
router.get('/posts/by/:userId', requireSign, postsByUser);
router.post('/post/new/:userId', requireSign, createPost, createPostValidator);
router.put('/post/:postId', requireSign, isPoster, updatePost);
router.delete('/post/:postId', requireSign, isPoster, deletePost);

router.param('userId', userById);
router.param('postId', postById);

module.exports = router;
