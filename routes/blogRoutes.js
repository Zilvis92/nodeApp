const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// GET routes
router.get('/', (req, res) => {res.render('index')});
router.get('/apie', blogController.getAboutPage);
router.get('/blogs/create-blog', blogController.getCreateBlogPage);
router.get('/blogs/:id', blogController.getBlogById);
router.get('/blogs', blogController.getAllBlogs);

// POST routes
router.post('/blogs/create-blog', blogController.createBlog);

// DELETE routes
router.delete('/blogs/:id', blogController.deleteBlog);

module.exports = router;