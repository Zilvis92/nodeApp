const blogService = require('../services/blogService');

class BlogController {
    // GET /api/blogs
    async getAllBlogs(req, res) {
        try {
            const blogs = await blogService.getAllBlogs();
            res.json({ 
                success: true, 
                data: blogs 
            });
        } catch (error) {
            console.error('Error getting blogs:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Server error' 
            });
        }
    }

    // GET /api/blogs/:id
    async getBlogById(req, res) {
        try {
            const blog = await blogService.getBlogById(req.params.id);
            if (!blog) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Naujiena nerasta' 
                });
            }
            res.json({ 
                success: true, 
                data: blog 
            });
        } catch (error) {
            console.error('Error getting blog:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Server error' 
            });
        }
    }

    // POST /api/blogs
    async createBlog(req, res) {
        try {
            const { title, santrauka, body } = req.body;
            
            if (!title || !santrauka || !body) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Pavadinimas, santrauka ir turinys yra privalomi' 
                });
            }

            const blogData = {
                title,
                santrauka,
                body,
                author: req.user.userId
            };

            const newBlog = await blogService.createBlog(blogData);
            res.status(201).json({ 
                success: true, 
                data: newBlog 
            });
        } catch (error) {
            console.error('Error creating blog:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Server error' 
            });
        }
    }

    // PUT /api/blogs/:id
    async updateBlog(req, res) {
        try {
            const { title, santrauka, body } = req.body;
            const blogId = req.params.id;

            if (!title || !santrauka || !body) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Pavadinimas, santrauka ir turinys yra privalomi' 
                });
            }

            const updatedBlog = await blogService.updateBlog(blogId, { 
                title, 
                santrauka, 
                body 
            });

            if (!updatedBlog) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Naujiena nerasta' 
                });
            }

            res.json({ 
                success: true, 
                data: updatedBlog 
            });
        } catch (error) {
            console.error('Error updating blog:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Server error' 
            });
        }
    }

    // DELETE /api/blogs/:id
    async deleteBlog(req, res) {
        try {
            const success = await blogService.deleteBlog(req.params.id);
            if (!success) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Naujiena nerasta' 
                });
            }
            res.json({ 
                success: true, 
                message: 'Naujiena sėkmingai ištrinta' 
            });
        } catch (error) {
            console.error('Error deleting blog:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Server error' 
            });
        }
    }
}

module.exports = BlogController;

// const blogService = require('../services/blogService');
// const blog = require('../src/models/blog');

// exports.getCreateBlogPage = (req, res) => {
//     res.render('create-blog', { 
//         title: 'Kurti naujiena',
//         editing: false,
//         blog: null 
//     });
// };

// exports.getBlogById = (req, res) => {
//     blogService.getBlogById(req.params.id).then(blog => {
//         if (blog) {
//             res.render('blog', { 
//                 title: blog.title, 
//                 blog: blog
//             });
//         } else {
//             res.status(404).render('404', { title: 'Naujiena nerasta' });
//         }
//     });
// };

// exports.createBlog = (req, res) => {
//     const { title, santrauka, body } = req.body;
    
//     // Paprasta validacija
//     if (!title || !santrauka || !body) {
//         return res.render('create-blog', { 
//             title: 'Kurti naujiena',
//             editing: false,
//             blog: { title, santrauka, body }, 
//             error: 'Visi laukai yra privalomi!' 
//         });
//     }
    
//     blogService.createBlog({ title, santrauka, body }).then(newBlog => {
//         if (newBlog) {
//             res.redirect('/');
//         } else {
//             res.render('create-blog', { 
//                 title: 'Kurti naujiena',
//                 editing: false,
//                 blog: { title, santrauka, body }, 
//                 error: 'Įvyko klaida išsaugant naujiena!' 
//             });
//         }
//     });
// };

// exports.getEditBlogPage = (req, res) => {
//     blogService.getBlogById(req.params.id).then(blog => {
//         if (blog) {
//             res.render('create-blog', { 
//                 title: 'Redaguoti naujieną',
//                 blog: blog,
//                 editing: true
//             });
//         } else {
//             res.status(404).render('404', { title: 'Naujiena nerasta' });
//         }
//     });
// };

// exports.updateBlog = (req, res) => {
//     const { title, santrauka, body } = req.body;
//     const blogId = req.params.id;
    
//     if (!title || !santrauka || !body) {
//         return blogService.getBlogById(blogId).then(blog => {
//             res.render('create-blog', { 
//                 title: 'Redaguoti naujieną', 
//                 error: 'Visi laukai yra privalomi!',
//                 blog: { _id: blogId, title, santrauka, body },
//                 editing: true
//             });
//         });
//     }
    
//     blogService.updateBlog(blogId, { title, santrauka, body }).then(updatedBlog => {
//         if (updatedBlog) {
//             res.redirect(`/blogs/${blogId}`);
//         } else {
//             res.render('create-blog', { 
//                 title: 'Redaguoti naujieną', 
//                 error: 'Įvyko klaida atnaujinant naujieną!',
//                 blog: { _id: blogId, title, santrauka, body },
//                 editing: true
//             });
//         }
//     });
// };

// exports.deleteBlog = (req, res) => {
//     blogService.deleteBlog(req.params.id).then(success => {
//         if (success) {
//             res.json({ success: true, message: 'Naujiena sėkmingai ištrinta' });
//         } else {
//             res.status(404).json({ success: false, message: 'Naujiena nerasta' });
//         }
//     });
// };