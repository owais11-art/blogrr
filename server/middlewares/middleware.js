const jwt = require('jsonwebtoken');

const Blog = require('../models/blogModel.js');

async function getBlogById(req, res, next){
    let gotBlog;
    try{
        gotBlog = await Blog.findById(req.params.id).populate("owner", {"email": 1, "followers": 1}).populate("comments", {"commentedTo": 0}).clone();
        if(gotBlog === null){
            return res.status(404).json({message: 'not found'});
        }
    }catch(err){
        res.status(500).json({
            message: "Something went wrong"
        });
    }
    req.blogById = gotBlog;
    next();
}

async function protectRoute(req, res, next){
    let token;
    let bearer = req.headers['authorization'];
    bearer = bearer.split(' ')[1];
    try{
        await jwt.verify(bearer, "SECRET_KEY", (err, result) => {
            if(err){
                console.log(err.message);
            } else token = result;
        });
    } catch(err){
        console.log(err.message)
    }
    req.token = token;
    next();
}

module.exports = {
    getBlogById,
    protectRoute
}