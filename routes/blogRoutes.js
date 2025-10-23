const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/pagesController');
const blogController = require('../controllers/blogController');

//Pages routes
router.get('/', pagesController.getHomePage);
router.get('/apie', pagesController.getAboutPage);

// Blog routes
router.get('/blogs/create-blog', blogController.getCreateBlogPage);
router.get('/blogs/:id', blogController.getBlogById);

// POST routes
router.post('/blogs/create-blog', blogController.createBlog);

// DELETE routes
router.delete('/blogs/:id', blogController.deleteBlog);

module.exports = router;