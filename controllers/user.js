const User = require('../models/user');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.userById = (req, res, next, id) => {
    User.findById(id)
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({ error: 'User not found' });
            }

            req.profile = user;
            next();
        });
};

exports.hasAuthorization = (req, res, next) => {
    const authorized =
        req.profile && req.auth && req.profile._id == req.auth._id;
    if (!authorized) {
        return res.status(403).json({ error: 'User not authorized' });
    }

    next();
};

exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.json(users);
    }).select('name email created updated');
};

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log({ err });
            return res.status(400).json({
                error: 'Photo could not be uploaded',
            });
        }
        let user = req.profile;
        user = _.extend(user, fields);
        user.updated = Date.now();

        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        });
    });
};

exports.deleteUser = (req, res) => {
    let user = req.profile;
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.json({ message: 'User deleted successfully' });
    });
};

exports.userPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set(('Content-Type', req.profile.photo.contentType));
        return res.send(req.profile.photo.data);
    }
    next();
};

exports.addFollowing = (req, res, next) => {
    const currentUserId = req.auth._id;
    console.log('teste', currentUserId);
    User.findByIdAndUpdate(
        currentUserId,
        { $push: { following: req.body.followId } },
        (err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            next();
        },
    );
};

exports.addFollower = (req, res) => {
    const currentUserId = req.auth._id;
    console.log('teste', currentUserId);
    User.findByIdAndUpdate(
        req.body.followId,
        { $push: { followers: currentUserId } },
        { new: true },
    )
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};

// remove follow unfollow
exports.removeFollowing = (req, res, next) => {
    const currentUserId = req.auth._id;
    User.findByIdAndUpdate(
        currentUserId,
        { $pull: { following: req.body.unfollowId } },
        (err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            next();
        },
    );
};

exports.removeFollower = (req, res) => {
    const currentUserId = req.auth._id;
    User.findByIdAndUpdate(
        req.body.unfollowId,
        { $pull: { followers: currentUserId } },
        { new: true },
    )
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};

exports.findPeople = (req, res) => {
    let exclude = req.profile.following;
    exclude.push(req.profile._id);
    User.find({ _id: { $nin: exclude } }, (err, users) => {
        if (err) {
            return res.status(400).json({
                error: err,
            });
        }
        res.json(users);
    }).select('name');
};
