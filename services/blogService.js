const mongoose = require('mongoose');
const Blog = require('../src/models/blog');
class BlogService {
    async getAllBlogs() {
        try {
            const blogs = await Blog.find().sort({ date: -1 });
            return blogs;
        } catch (error) {
            console.error('Error getting all blogs:', error);
            throw error;
        }
    }

    async getBlogById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return null;
            }
            
            const blog = await Blog.findById(id);
            return blog;
        } catch (error) {
            console.error('Error getting blog by id:', error);
            throw error;
        }
    }

    async createBlog(blogData) {
        try {
            const newBlog = new Blog({
                title: blogData.title,
                santrauka: blogData.santrauka,
                body: blogData.body
            });
            
            const savedBlog = await newBlog.save();
            return savedBlog;
        } catch (error) {
            console.error('Error creating blog:', error);
            throw error;
        }
    }

    async deleteBlog(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return false;
            }
            
            const result = await Blog.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            console.error('Error deleting blog:', error);
            throw error;
        }
    }
}

module.exports = new BlogService();