const express = require('express');

const { getBlogById, protectRoute } = require('../middlewares/middleware.js');

const { getBlogs, createBlog, getBlog, updateBlog, deleteBlog, likeBlog, dislikeBlog } = require('../controllers/blogRouteController.js');

const router = express.Router();

router.route('/').get(getBlogs).post(protectRoute, createBlog);

router.route('/:id').get(protectRoute, getBlogById, getBlog).put(protectRoute, getBlogById, updateBlog).delete(protectRoute, getBlogById, deleteBlog);

router.post('/like/:id', protectRoute, getBlogById, likeBlog);

router.post('/dislike/:id', protectRoute, getBlogById, dislikeBlog);

module.exports = router;