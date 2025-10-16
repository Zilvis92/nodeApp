const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// GET routes
router.get('/', blogController.getHomePage);
router.get('/apie', blogController.getAboutPage);
router.get('/blogs/create-blog', blogController.getCreateBlogPage);
router.get('/blogs/:id', blogController.getBlogById);

// POST routes
router.post('/blogs/create-blog', blogController.createBlog);

// DELETE routes
router.delete('/blogs/:id', blogController.deleteBlog);

module.exports = router;