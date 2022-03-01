const Blog = require('../models/blogModel.js');

const User = require('../models/userModel.js');

const getBlogs = async(req, res) => {
        try{
            await Blog.find({}, (err, blogs) => {
                if(err){
                    res.status(500).json({
                        message: "Something went wrong"
                    });
                } else{
                    res.json(blogs);
                }
            }).populate("owner", {"email": 1}).populate("comments", {"commentedTo": 0}).sort({date_posted: -1}).clone();
        }catch(err){
            res.status(500).json({
                message: "Something went wrong"
            });
        }
}

const createBlog = async(req, res) => {
    if(!req.token){
        res.status(400).json({message: "Route Protected"});
        return;
    }
    try{
        const user = await User.findOne({_id: req.body.owner}).clone();
        const blog = new Blog({
            title: req.body.title,
            author: req.body.author,
            content: req.body.content,
            owner: req.body.owner
        });
        await blog.save();
        user.blogs.push(blog._id);
        await user.save(() => res.json({message: 'Blog Posted'}));
    }catch(err){
        res.status(400).json({
            message: err.message
        });
    }
}

const getBlog = (req, res) => {
    if(!req.token){
        res.status(400).json({message: "Route Protected"});
        return;
    }
    const blog = req.blogById;
    if(blog){
        res.json(blog);
    }
}

const updateBlog = async(req, res) => {
    if(!req.token){
        res.status(400).json({message: "Route Protected"});
        return;
    }
    const blog = req.blogById;
    try{
        if(blog){
            blog.title = req.body.title;
            blog.author = req.body.author;
            blog.content = req.body.content;
            await blog.save();
            res.json({message: 'Blog Updated'});
        }
    }catch(err){
        res.staus(400).json({message: err.message});
    }
}

const deleteBlog = async(req, res) => {
    if(!req.token){
        res.status(400).json({message: "Route Protected"});
        return;
    }
    const blog = req.blogById;
    try{
        if(blog){
            const user = await User.findById(blog.owner._id).clone();
            user.blogs.pull(blog._id);
            await user.save();
            await Blog.deleteOne({_id: blog._id});
            res.json({
                message: "blog deleted"
            });
        }
    }catch(err){
        res.status(400).json({message: err.message});
    }
}

const getLikeDislike = async(email, blogId) => {
    let result = {};
    try{
        const liked = await Blog.find({_id: blogId,"likes.email": email}, {likes: 1, _id: 0}).clone();
        const disliked = await Blog.find({_id: blogId,"dislikes.email": email}, {dislikes: 1, _id: 0}).clone();

        //checking given email is already in likes field or not.👇
        if(liked.length === 0){
            result.likeId = false;
        }else{
            const[ likeObj ] = liked;
            const{ likes } = likeObj;
            const[ likeData ] = likes;
            const{ _id: id } = likeData;
            result.likeId = id;
        }

        // checking given email is already in dislikes field or not.👇
        if(disliked.length === 0){
            result.dislikeId = false;
        }else{
            const[ dislikeObj ] = disliked;
            const{ dislikes } = dislikeObj;
            const[ dislikeData ] = dislikes;
            const{ _id: id } = dislikeData;
            result.dislikeId = id;
        }

        result.error = false;
        return result;
    }catch(err){
        result.error = true;
        result.message = err.message;
        return result;
    }
}

const likeBlog = async(req, res) => {
    const blog = req.blogById;
    try{
        if(blog){
            //function for checking if user is already in likes or dislikes field.👇
            const result = await getLikeDislike(req.body.email, blog._id);
            if(result.error){
                res.status(500).json({message: result.message});
            }else{
                const{ likeId, dislikeId } = result;
                if(likeId){
                    blog.likes.pull(likeId);
                }else{
                    blog.likes.push({
                        likedBy: req.body.username,
                        email: req.body.email
                    });
                }

                if(dislikeId){
                    blog.dislikes.pull(dislikeId);
                }
                await blog.save(() => res.json({message: "blog liked😊"}));
            }
        }
    }catch(err){
        res.status(400).json({message: err.message});
    }
}

const dislikeBlog = async(req, res) => {
    const blog = req.blogById;
    try{
        if(blog){
            const result = await getLikeDislike(req.body.email, blog._id);
            if(result.error){
                res.status(500).json({message: result.message});
            }else{
                const{ likeId, dislikeId } = result;
                if(dislikeId){
                    blog.dislikes.pull(dislikeId);
                }else{
                    blog.dislikes.push({
                        dislikedBy: req.body.username,
                        email: req.body.email
                    });
                }

                if(likeId){
                    blog.likes.pull(likeId);
                }
                await blog.save(() => res.json({message: "blog disliked😒"}));
            }
        }
    }catch(err){
        res.status(400).json({message: err.message});
    }
}

module.exports = {
    getBlogs,
    createBlog,
    getBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog
}