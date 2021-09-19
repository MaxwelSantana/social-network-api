const User = require('../models/user');

exports.userById = (req, res, next, id) => {
    User.findOneById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: 'User not found' });
        }

        req.profile = user;
        next();
    });
};

exports.hasAuthorization = (req, res, next) => {
    const authorized =
        req.profile && req.auth && req.profile._id === req.auth._id;
    if (!authorized) {
        return res.status(403).json({ message: 'User not authorized' });
    }

    next();
};
