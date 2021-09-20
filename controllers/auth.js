const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const User = require('../models/user');
require('dotenv').config();

exports.signup = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists)
        return res.status(403).json({ error: 'User already exists' });

    const user = new User(req.body);
    await user.save();
    res.json({ user });
    // res.json({ message: 'Signup success! Please Login' });
};

exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                error: 'User not found. Please Sign up       ',
            });
        }
        console.log({ user });
        if (!user.authenticate(password)) {
            res.status(401).json({ error: 'Email or password do not match' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        res.cookie('t', token);

        const { _id, name, email } = user;
        res.json({
            token,
            user: {
                _id,
                name,
                email,
            },
        });
    });
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'Sign out successfully' });
};

exports.requireSign = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth',
});
