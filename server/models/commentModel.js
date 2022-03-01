const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    commenterEmail: {
        type: String,
        required: true
    },
    commenterUsername: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    commentedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    },
    commented_on: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Comment', commentSchema);