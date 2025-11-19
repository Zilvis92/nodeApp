const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const BlogController = require('../controllers/blogController');
const { authenticateToken } = require('../middleware/authMiddleware');

const authController = new AuthController();
const blogController = new BlogController();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.post('/auth/verify', authController.verifyToken);

// Blog routes
router.get('/blogs', blogController.getAllBlogs);
router.get('/blogs/:id', blogController.getBlogById);

router.post('/blogs', authenticateToken, blogController.createBlog);

router.put('/blogs/:id', authenticateToken, blogController.updateBlog);

router.delete('/blogs/:id', authenticateToken, blogController.deleteBlog);

// User routes
router.get('/user/profile', authenticateToken, authController.getProfile);

module.exports = router;