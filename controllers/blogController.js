const blogService = require('../services/blogService');

exports.getCreateBlogPage = (req, res) => {
    res.render('create-blog', { title: 'Kurti naujiena' });
};

exports.getBlogById = (req, res) => {
    blogService.getBlogById(req.params.id).then(blog => {
        if (blog) {
            res.render('blog', { 
                title: blog.title, 
                blog: blog
            });
        } else {
            res.status(404).render('404', { title: 'Naujiena nerasta' });
        }
    });
};

exports.createBlog = (req, res) => {
    const { title, santrauka, body } = req.body;
    
    // Paprasta validacija
    if (!title || !santrauka || !body) {
        return res.render('create-blog', { 
            title: 'Kurti naujiena', 
            error: 'Visi laukai yra privalomi!' 
        });
    }
    
    blogService.createBlog({ title, santrauka, body }).then(newBlog => {
        if (newBlog) {
            res.redirect('/');
        } else {
            res.render('create-blog', { 
                title: 'Kurti naujiena', 
                error: 'Įvyko klaida išsaugant naujiena!' 
            });
        }
    });
};

exports.deleteBlog = (req, res) => {
    blogService.deleteBlog(req.params.id).then(success => {
        if (success) {
            res.json({ success: true, message: 'Naujiena sėkmingai ištrinta' });
        } else {
            res.status(404).json({ success: false, message: 'Naujiena nerasta' });
        }
    });
};