const Post = require('../models/post');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.postById = (req, res, next, id) => {
    Post.findById(id)
        .populate('postedBy', '_id name')
        .exec((err, post) => {
            if (err || !post) {
                return res.status(404).json({ error: err });
            }

            req.post = post;
            next();
        });
};

exports.getPosts = (req, res) => {
    const posts = Post.find()
        .populate('postedBy', '_id name')
        .select('_id title body created')
        .sort({ created: -1 })
        .then((posts) => {
            res.json(posts);
        })
        .catch((err) => {
            console.error(err);
        });
};

exports.postsByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id name')
        .select('_id title body')
        .sort('created')
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            res.json(posts);
        });
};

exports.createPost = (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: 'The file upload failed' });
        }
        let post = new Post(fields);
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.type = files.photo.type;
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }

            res.json(result);
        });
    });
};

exports.isPoster = (req, res, next) => {
    const isPoster =
        req.post && req.auth && req.post.postedBy._id == req.auth._id;

    if (!isPoster) {
        return res.status(403).json({ error: 'User not authorized' });
    }
    next();
};

exports.updatePost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded',
            });
        }
        // save post
        let post = req.post;
        post = _.extend(post, fields);
        post.updated = Date.now();

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }
            res.json(post);
        });
    });
};

exports.deletePost = (req, res, next) => {
    const post = req.post;
    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.json({ message: 'Post deleted successfully' });
    });
};

exports.photo = (req, res, next) => {
    res.set('Content-Type', req.post.photo.contentType);
    return res.send(req.post.photo.data);
};

exports.singlePost = (req, res) => {
    res.json(req.post);
};

exports.like = (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        { $addToSet: { likes: req.body.userId } },
        { new: true },
    ).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err,
            });
        } else {
            res.json(result);
        }
    });
};

exports.unlike = (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        { $pull: { likes: req.body.userId } },
        { new: true },
    ).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err,
            });
        } else {
            res.json(result);
        }
    });
};
