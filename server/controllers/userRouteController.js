const User = require('../models/userModel.js');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const getUser = async(req, res) => {
    try{
        await User.find({}, (err, users) =>{
            if(err){
                res.status(400).json({
                    message: "Something went wrong"
                })
            }else{
                res.json(users);
            }
        }).clone()
    } catch(err){
        res.status(500).json({
            message: 'Some Error happened'
        });
    }
}

const registerUser = async(req, res) => {
    const user = await User.findOne({'email': req.body.email}).clone();
    if(user){
        res.status(400).json({message: "Email already exists"});
        return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    try{
        const user = new User({
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword
        });
        await user.save(() => res.json({message: "Registration Successful"}));
    } catch(err){
        res.status(200).json({
            message: "Some Error happened"
        });
    }
}

const loginUser = async (req, res) => {
    try{
        const user = await User.findOne({'email': req.body.email}).clone();
        if(user){
            const validate = await bcrypt.compare(req.body.password, user.password);
                if(validate){
                    await jwt.sign({id: user._id}, "SECRET_KEY", (err, token) => {
                        if(err){
                            res.status(400).json({message: err.message});
                        }else{
                            res.json({
                                username: user.username,
                                email: user.email,
                                id: user._id,
                                token
                            });
                        }
                    });
                }else{
                    res.status(400).json({message: "Incorrect password"});
                }
        }else{
            res.status(404).json({message: 'user not found'});
        }
    } catch(err){
        res.status(400).json({
            message: "Incorrect Email or Password"
        });
    }
}

const followUser = async(req, res) => {
    if(!req.token){
        res.status(400).json({message: "Route Protected"});
        return;
    }
    try{
        const user = await User.findOne({_id: req.params.id}).clone();
        const currentUser = await User.findOne({_id: req.body.id}).clone();
        if(user && currentUser){
            if(!user.followers.includes(req.body.id)){
                user.followers.push(req.body.id);
            }else{
                user.followers.pull(req.body.id);
            }
            if(!currentUser.following.includes(req.params.id)){
                currentUser.following.push(req.params.id);
            }else{
                currentUser.following.pull(req.params.id);
            }
            await user.save();
            await currentUser.save();
            res.json({
                user: user,
                currentUser: currentUser
            });
        }else{
            res.status(400).json({message: "bad request"});
        }
    }catch(err){
        res.status(400).json({message: err.message});
    }
}

module.exports = {
    getUser,
    registerUser,
    loginUser,
    followUser
}