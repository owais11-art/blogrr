const Comment = require('../models/commentModel.js');

const Blog = require('../models/blogModel.js');

const createComment = async(req, res) => {
    if(!req.token){
        res.status(400).json({message: "Route Protected"});
        return;
    }
    try{
        const newComment = new Comment({
            commenterEmail: req.body.email,
            commenterUsername: req.body.username,
            comment: req.body.comment,
            commentedTo: req.body.commentedTo
        });
        await newComment.save();
        const blog = await Blog.findById(req.body.commentedTo).clone();
        blog.comments.push(newComment._id);
        let commentPopulated = await blog.populate("comments", {"commentedTo": 0})
        await blog.save(() => res.json(commentPopulated.comments));
    }catch(err){
        res.status(400).json({
            message: "Invalid Information"
        });
    }
}

const deleteComment = async(req, res) => {
    if(!req.token){
        res.status(400).json({message: "Route Protected"});
        return;
    }
    try{
        const comment = await Comment.findById(req.params.id).clone();
        const blog = await Blog.findById(comment.commentedTo).clone();
        blog.comments.pull(comment._id);
        await blog.save();
        await Comment.deleteOne({_id: comment._id});
        res.json({message: "comment deleted"});
    } catch(err){
        res.status(404).json({message: err.message});
    }
}

module.exports = {
    createComment,
    deleteComment
}