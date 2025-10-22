// services/blogService.js
const mongoose = require('mongoose');
const Blog = require('../src/models/blog');

class BlogService {
    getAllBlogs() {
        return Blog.find().sort({ date: -1 })
            .then(blogs => blogs)
            .catch(error => {
                console.error('Error getting all blogs:', error);
                throw error;
            });
    }

    getBlogById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Promise.resolve(null);
        }
        
        return Blog.findById(id)
            .then(blog => blog)
            .catch(error => {
                console.error('Error getting blog by id:', error);
                throw error;
            });
    }

    createBlog(blogData) {
        const newBlog = new Blog({
            title: blogData.title,
            santrauka: blogData.santrauka,
            body: blogData.body
        });
        
        return newBlog.save()
            .then(savedBlog => savedBlog)
            .catch(error => {
                console.error('Error creating blog:', error);
                throw error;
            });
    }

    deleteBlog(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Promise.resolve(false);
        }
        
        return Blog.findByIdAndDelete(id)
            .then(result => result !== null)
            .catch(error => {
                console.error('Error deleting blog:', error);
                throw error;
            });
    }
}

module.exports = new BlogService();