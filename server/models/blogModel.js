const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    likedBy: String,
    email: String,
    likedAt: {
        type: Date,
        default: Date.now()
    }
});

const dislikeSchema = new mongoose.Schema({
    dislikedBy: String,
    email: String,
    dislikedAt: {
        type: Date,
        default: Date.now()
    }
});

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    date_posted: {
        type: Date,
        default: Date.now()
    },
    date_updated: {
        type: Date,
        default: Date.now()
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    likes: [
        likeSchema
    ],
    dislikes: [
        dislikeSchema
    ]
});

module.exports = mongoose.model('Blog', blogSchema);