const express = require('express');
const path = require('path');
const session = require('express-session');
const connectDB = require('./config/database');
const blogRoutes = require('./routes/blogRoutes');
const { authViewMiddleware } = require('./middleware/authMiddleware');

const app = express();

// Session middleware
app.use(session({
    secret: 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // nustatyti true jei naudojate HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 valandos
    }
}));

// Auth middleware for views
app.use(authViewMiddleware);

// Middleware, kuris perduoda user duomenis į visus views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

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
    res.status(404).render('404', { 
        title: 'Puslapis nerastas', 
        message: 'Pageidaujamas puslapis nerastas.' 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('404', { 
        title: 'Serverio klaida',
        message: 'Atsiprašome, įvyko serverio klaida. Bandykite vėliau.'
    });
});

// Pirmiausia prisijungiame prie DB, tada paleidžiame serverį
const startServer = async () => {
    try {
        console.log('🔗 Bandome prisijungti prie duomenų bazės...');
        await connectDB();
        console.log('✅ Duomenų bazė sėkmingai prisijungta');
        
        const PORT = 3001;
        app.listen(PORT, () => {
            console.log(`🚀 Serveris veikia http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Nepavyko paleisti serverio:', error);
        process.exit(1);
    }
};

// Paleidžiame serverį
startServer();