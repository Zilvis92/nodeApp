const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: String,
    santrauka: String,
    body: String,
    date: Date
})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;