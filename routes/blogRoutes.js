const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/pagesController');
const blogController = require('../controllers/blogController');
const AuthController = require('../controllers/AuthController');

const authController = new AuthController();

//Pages routes
router.get('/', pagesController.getHomePage);
router.get('/apie', pagesController.getAboutPage);

// Blog routes
router.get('/blogs/create-blog', blogController.getCreateBlogPage);
router.get('/blogs/edit/:id', blogController.getEditBlogPage);
router.get('/blogs/:id', blogController.getBlogById);

// Auth routes
router.get('/loginPage', authController.getLoginPage);
router.get('/register', authController.getRegisterPage);
router.get('/logout', authController.logout);

// POST routes
router.post('/blogs/create-blog', blogController.createBlog);
router.post('/blogs/edit/:id', blogController.updateBlog);
router.post('/register', authController.register);
router.post('/loginPage', authController.login);

// DELETE routes
router.delete('/blogs/:id', blogController.deleteBlog);

module.exports = router;