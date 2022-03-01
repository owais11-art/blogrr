const express = require('express');

const { getUser, registerUser, loginUser, followUser } = require('../controllers/userRouteController.js');

const{protectRoute} = require('../middlewares/middleware.js');

const router = express.Router();

router.get('/', getUser);

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/follow/:id', protectRoute, followUser);



module.exports = router;