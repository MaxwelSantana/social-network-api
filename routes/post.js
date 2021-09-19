const express = require('express');
const { getPosts, createPost } = require('../controllers/post');
const { createPostValidator } = require('../validators');
const { requireSign } = require('../controllers/auth');
const { userById } = require('../controllers/user');

const router = express.Router();

router.get('/', getPosts);
router.post('/', requireSign, createPostValidator, createPost);

router.param('userId', userById);

module.exports = router;
