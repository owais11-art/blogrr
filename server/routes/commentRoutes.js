const express = require('express');

const { createComment, deleteComment } = require('../controllers/commentRouteController.js');

const { protectRoute } = require('../middlewares/middleware.js');

const router = express.Router();

router.post('/', protectRoute, createComment);

router.delete('/:id', protectRoute, deleteComment);

module.exports = router;