const fs = require('fs').promises;
const path = require('path');

const BLOGS_FILE = path.join(__dirname, '..', 'data', 'blogs.json');

class BlogService {
    async getAllBlogs() {
        try {
            const data = await fs.readFile(BLOGS_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Jei failas neegzistuoja, sukuriame tuščią
                await this.saveBlogs([]);
                return [];
            }
            throw error;
        }
    }

    async getBlogById(id) {
        const blogs = await this.getAllBlogs();
        return blogs.find(blog => blog.id === id);
    }

    async createBlog(blogData) {
        const blogs = await this.getAllBlogs();
        const newBlog = {
            id: blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1,
            title: blogData.title,
            santrauka: blogData.santrauka,
            body: blogData.body,
            date: new Date().toISOString().split('T')[0]
        };
        
        blogs.push(newBlog);
        await this.saveBlogs(blogs);
        return newBlog;
    }

    async deleteBlog(id) {
        const blogs = await this.getAllBlogs();
        const blogIndex = blogs.findIndex(blog => blog.id === id);
        
        if (blogIndex !== -1) {
            blogs.splice(blogIndex, 1);
            await this.saveBlogs(blogs);
            return true;
        }
        return false;
    }

    async saveBlogs(blogs) {
        // Įsitikiname, kad data direktorija egzistuoja
        const dataDir = path.dirname(BLOGS_FILE);
        await fs.mkdir(dataDir, { recursive: true });
        await fs.writeFile(BLOGS_FILE, JSON.stringify(blogs, null, 2));
    }
}

module.exports = new BlogService();