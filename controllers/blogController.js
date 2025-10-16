const blogService = require('../services/blogService');

exports.getHomePage = async (req, res) => {
    try {
        const blogs = await blogService.getAllBlogs();
        res.render('index', { title: 'Pamokos', blogs });
    } catch (error) {
        console.error('Error getting home page:', error);
        res.status(500).render('error', { title: 'Klaida' });
    }
};

exports.getAboutPage = (req, res) => {
    res.render('apie', { title: 'Apie' });
};

exports.getCreateBlogPage = (req, res) => {
    res.render('create-blog', { title: 'Kurti pamoką' });
};

exports.getBlogById = async (req, res) => {
    try {
        const blogId = parseInt(req.params.id);
        const blog = await blogService.getBlogById(blogId);
        
        if (blog) {
            res.render('blog', { title: blog.title, blog });
        } else {
            res.status(404).render('404', { title: 'Pamoka nerasta' });
        }
    } catch (error) {
        console.error('Error getting blog by id:', error);
        res.status(500).render('error', { title: 'Klaida' });
    }
};

exports.createBlog = async (req, res) => {
    try {
        const { title, santrauka, body } = req.body;
        
        // Validacija
        if (!title || !santrauka || !body) {
            return res.status(400).render('create-blog', { 
                title: 'Kurti pamoką', 
                error: 'Visi laukai yra privalomi!' 
            });
        }
        
        const newBlog = await blogService.createBlog({ title, santrauka, body });
        
        if (newBlog) {
            res.redirect('/');
        } else {
            res.status(500).render('create-blog', { 
                title: 'Kurti pamoką', 
                error: 'Įvyko klaida išsaugant pamoką!' 
            });
        }
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).render('create-blog', { 
            title: 'Kurti pamoką', 
            error: 'Įvyko klaida!' 
        });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blogId = parseInt(req.params.id);
        const success = await blogService.deleteBlog(blogId);
        
        if (success) {
            res.json({ success: true, message: 'Pamoka sėkmingai ištrinta' });
        } else {
            res.status(404).json({ success: false, message: 'Pamoka nerasta' });
        }
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ success: false, message: 'Klaida ištrinant pamoką' });
    }
};