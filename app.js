const express = require('express');
const path = require('path');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// EJS konfigūracija
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', blogRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { title: 'Puslapis nerastas' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        title: 'Klaida', 
        error: process.env.NODE_ENV === 'development' ? err : {} 
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serveris veikia http://localhost:${PORT}`);
});