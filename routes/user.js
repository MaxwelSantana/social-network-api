const express = require('express');
const {
    allUsers,
    userById,
    getUser,
    updateUser,
    deleteUser,
} = require('../controllers/user');
const { requireSign } = require('../controllers/auth');

const router = express.Router();

router.get('/users', allUsers);
router.get('/user/:userId', requireSign, getUser);
router.put('/user/:userId', requireSign, updateUser);
router.delete('/user/:userId', requireSign, deleteUser);

router.param('userId', userById);

module.exports = router;
