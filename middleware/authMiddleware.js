const jwtService = require('../services/jwtService');

// Middleware JWT token patikrinimui
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            success: false,
            error: 'Access token required' 
        });
    }

    try {
        const decoded = jwtService.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ 
            success: false,
            error: 'Invalid or expired token' 
        });
    }
};

// Middleware, kuris reikalauja prisijungimo
const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            success: false,
            error: 'Authentication required' 
        });
    }
    next();
};

module.exports = {
    authenticateToken,
    requireAuth
};

// const { decode } = require('jsonwebtoken');
// const jwtService = require('../services/jwtService');

// // Middleware JWT token patikrinimui
// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         // Jei nėra token, tikriname sesiją
//         if (req.session.user) {
//             req.user = req.session.user;
//             return next();
//         }
//         return res.status(401).json({ error: 'Access token required' });
//     }

//     try {
//         const decoded = jwtService.verifyToken(token);
//         req.user = {
//             id: decoded.userId,
//             firstName: decoded.firstName,
//             lastName: decoded.lastName
//         };
//         next();
//     } catch (error) {
//         return res.status(403).json({ error: 'Invalid or expired token' });
//     }
// };

// // Middleware views (EJS) - perduoda user duomenis į visus views
// const authViewMiddleware = (req, res, next) => {
//     // Pirmiausia bandome gauti user iš sesijos
//     if (req.session.user) {
//         res.locals.user = req.session.user;
//         return next();
//     }

//     // Jei nėra sesijos, bandome iš JWT token
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (token) {
//         try {
//             // pasidebuginti kas yra viduje
//             const decoded = jwtService.verifyToken(token);
//             res.locals.user = {
//                 id: decoded.userId,
//                 firstName: decoded.firstName,
//                 lastName: decoded.lastName,
//             };
//         } catch (error) {
//             // Token nevalidus, tęsiame be user
//             res.locals.user = null;
//         }
//     } else {
//         res.locals.user = null;
//     }

//     next();
// };

// // Middleware, kuris reikalauja prisijungimo
// const requireAuth = (req, res, next) => {
//     if (!req.user && !req.session.user) {
//         if (req.xhr || req.headers.accept.indexOf('json') > -1) {
//             return res.status(401).json({ error: 'Authentication required' });
//         }
//         return res.redirect('/loginPage');
//     }
//     next();
// };

// module.exports = {
//     authenticateToken,
//     authViewMiddleware,
//     requireAuth
// };