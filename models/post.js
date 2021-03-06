mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        minLength: 4,
        maxLength: 150,
    },

    body: {
        type: String,
        require: true,
        minLength: 4,
        maxLength: 2000,
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    updated: Date,
    postedBy: {
        type: ObjectId,
        ref: 'User',
    },
    created: {
        type: Date,
        default: Date.now,
    },
    likes: [{ type: ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Post', postSchema);
