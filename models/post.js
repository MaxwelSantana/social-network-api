mongoose = require('mongoose');

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
});

module.exports = mongoose.model('Post', postSchema);
