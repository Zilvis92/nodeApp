const blogService = require('../services/blogService');

exports.getHomePage = async (req, res) => {
    const blogs = await blogService.getAllBlogs();
    res.render('index', { 
        title: 'Naujienos', 
        blogs: blogs,
    });
};

exports.getAboutPage = (req, res) => {
    res.render('apie', { title: 'Apie' });
};