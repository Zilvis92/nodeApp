require('dotenv').config();
const express = require('express');
// const path = require('path');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/database');
// const blogRoutes = require('./routes/blogRoutes');
// const { authViewMiddleware } = require('./middleware/authMiddleware');

const app = express();

// CORS konfigūracija - leisti abu frontend adresus
const allowedOrigins = process.env.FRONTEND_URL ? 
    process.env.FRONTEND_URL.split(',') : 
    ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
    origin: function (origin, callback) {
        // Leisti requests be origin (pvz., Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            console.log('❌ CORS blocked origin:', origin);
            return callback(new Error(`CORS policy: Origin ${origin} not allowed`), false);
        }
        
        console.log('✅ CORS allowed origin:', origin);
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// // Auth middleware for views
// app.use(authViewMiddleware);

// // EJS konfigūracija
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Routes
// app.use('/', blogRoutes);

// API Routes (naudojame API routes, ne EJS)
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Backend API veikia sėkmingai',
        environment: process.env.NODE_ENV,
        port: process.env.PORT
    });
});

// 404 handler for API
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false,
        error: 'Endpoint not found' 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// // 404 handler
// app.use((req, res) => {
//     res.status(404).render('404', { 
//         title: 'Puslapis nerastas', 
//         message: 'Pageidaujamas puslapis nerastas.' 
//     });
// });

// // Error handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).render('404', { 
//         title: 'Serverio klaida',
//         message: 'Atsiprašome, įvyko serverio klaida. Bandykite vėliau.'
//     });
// });

// Pirmiausia prisijungiame prie DB, tada paleidžiame serverį
const startServer = async () => {
    try {
        console.log('🔗 Bandome prisijungti prie duomenų bazės...');
        await connectDB();
        console.log('✅ Duomenų bazė sėkmingai prisijungta');
        
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`🚀 Backend API serveris veikia http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ Nepavyko paleisti serverio:', error);
        process.exit(1);
    }
};

// Paleidžiame serverį
startServer();