const User = require('../src//models/User');
const jwtService = require('../services/jwtService');

class AuthController {
    // POST /api/auth/register
    async register(req, res) {
        try {
            const { firstName, lastName, email, password } = req.body;

            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Visi laukai yra privalomi!' 
                });
            }

            if (password.length < 6) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Slaptažodis turi būti bent 6 simbolių ilgio!' 
                });
            }

            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(409).json({ 
                    success: false, 
                    error: 'Vartotojas su šiuo el. paštu jau egzistuoja!' 
                });
            }

            const newUser = new User({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.toLowerCase().trim(),
                password
            });

            await newUser.save();

            const token = jwtService.generateUserToken(newUser);

            res.status(201).json({
                success: true,
                message: 'Registracija sėkminga!',
                token: token,
                user: {
                    id: newUser._id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email
                }
            });

        } catch (error) {
            console.error('Registracijos klaida:', error);
            
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({ 
                    success: false, 
                    error: errors.join(', ') 
                });
            }

            res.status(500).json({ 
                success: false, 
                error: 'Įvyko klaida registruojant. Bandykite dar kartą.' 
            });
        }
    }

    // POST /api/auth/login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'El. paštas ir slaptažodis yra privalomi!' 
                });
            }

            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    error: 'Neteisingas el. paštas arba slaptažodis!' 
                });
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({ 
                    success: false, 
                    error: 'Neteisingas el. paštas arba slaptažodis!' 
                });
            }

            const token = jwtService.generateUserToken(user);

            res.json({
                success: true,
                message: 'Prisijungimas sėkmingas!',
                token: token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            });

        } catch (error) {
            console.error('Prisijungimo klaida:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Įvyko klaida prisijungiant. Bandykite dar kartą.' 
            });
        }
    }

    // POST /api/auth/logout
    logout(req, res) {
        // JWT blacklist logic here if needed
        res.json({ success: true, message: 'Atsijungta sėkmingai!' });
    }

    // GET /api/user/profile
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.userId).select('-password');
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Vartotojas nerastas' 
                });
            }
            res.json({ 
                success: true, 
                data: user 
            });
        } catch (error) {
            console.error('Profilio klaida:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Serverio klaida' 
            });
        }
    }

    // POST /api/auth/verify
    verifyToken(req, res) {
        try {
            const token = req.body.token;
            
            if (!token) {
                return res.status(400).json({ 
                    success: false,
                    error: 'Token yra privalomas' 
                });
            }

            if (jwtService.isBlacklisted && jwtService.isBlacklisted(token)) {
                return res.json({
                    valid: false,
                    error: 'Token atšauktas'
                });
            }

            const decoded = jwtService.verifyToken(token);
            res.json({
                valid: true,
                user: decoded
            });

        } catch (error) {
            res.json({
                valid: false,
                error: error.message
            });
        }
    }
}

module.exports = AuthController;

// const User = require('../src/models/User');
// const jwtService = require('../services/jwtService');

// class AuthController {
//     getLoginPage(req, res) {
//         if (req.session.user) {
//             return res.redirect('/');
//         }
        
//         res.render('loginPage', { 
//             title: 'Prisijungti',
//             error: req.query.error,
//             success: req.query.success
//         });
//     }

//     getRegisterPage(req, res) {
//         if (req.session.user) {
//             return res.redirect('/');
//         }
        
//         res.render('register', { 
//             title: 'Registruotis',
//             error: req.query.error,
//             success: req.query.success
//         });
//     }

//     // POST /register
//     async register(req, res) {
//         try {
//             // Jei jau prisijungęs, nukreipiame į pagrindinį puslapį
//             if (req.session.user) {
//                 return res.redirect('/');
//             }

//             console.log('Registracijos bandymas:', req.body);
//             const { firstName, lastName, email, password } = req.body;

//             // Validacija
//             if (!firstName || !lastName || !email || !password) {
//                 return res.render('register', {
//                     title: 'Registruotis',
//                     error: 'Visi laukai yra privalomi!',
//                     formData: { firstName, lastName, email }
//                 });
//             }

//             if (password.length < 6) {
//                 return res.render('register', {
//                     title: 'Registruotis',
//                     error: 'Slaptažodis turi būti bent 6 simbolių ilgio!',
//                     formData: { firstName, lastName, email }
//                 });
//             }

//             // Tikriname ar vartotojas jau egzistuoja
//             const existingUser = await User.findOne({ email: email.toLowerCase() });
//             if (existingUser) {
//                 return res.render('register', {
//                     title: 'Registruotis',
//                     error: 'Vartotojas su šiuo el. paštu jau egzistuoja!',
//                     formData: { firstName, lastName, email }
//                 });
//             }

//             // Sukuriame naują vartotoją
//             const newUser = new User({
//                 firstName: firstName.trim(),
//                 lastName: lastName.trim(),
//                 email: email.toLowerCase().trim(),
//                 password
//             });

//             await newUser.save();
//             console.log('Naujas vartotojas sukurtas:', newUser.email);

//             // Generuojame JWT token
//             const token = jwtService.generateUserToken(newUser);

//             // Automatiškai prisijungiame po registracijos
//             req.session.user = {
//                 id: newUser._id,
//                 firstName: newUser.firstName,
//                 lastName: newUser.lastName,
//                 email: newUser.email,
//                 token: token
//             };

//             // Galime grąžinti token ir kaip cookie arba response
//             res.cookie('auth_token', token, {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production',
//                 maxAge: 24 * 60 * 60 * 1000 // 24 valandos
//             });

//             res.redirect('/?success=Registracija sėkminga! Esate prisijungęs.');

//         } catch (error) {
//             console.error('Registracijos klaida:', error);
            
//             if (error.name === 'ValidationError') {
//                 const errors = Object.values(error.errors).map(err => err.message);
//                 return res.render('register', {
//                     title: 'Registruotis',
//                     error: errors.join(', '),
//                     formData: req.body
//                 });
//             }

//             res.render('register', {
//                 title: 'Registruotis',
//                 error: 'Įvyko klaida registruojant. Bandykite dar kartą.',
//                 formData: req.body
//             });
//         }
//     }

//     // POST /loginPage
//     async login(req, res) {
//         try {
//             // Jei jau prisijungęs, nukreipiame į pagrindinį puslapį
//             if (req.session.user) {
//                 return res.redirect('/');
//             }

//             const { email, password } = req.body;
//             console.log('Prisijungimo bandymas:', email);

//             // Validacija
//             if (!email || !password) {
//                 return res.render('loginPage', {
//                     title: 'Prisijungti',
//                     error: 'El. paštas ir slaptažodis yra privalomi!',
//                     formData: { email }
//                 });
//             }

//             // Randame vartotoją
//             const user = await User.findOne({ email: email.toLowerCase() });
//             if (!user) {
//                 console.log('Vartotojas nerastas:', email);
//                 return res.render('loginPage', {
//                     title: 'Prisijungti',
//                     error: 'Neteisingas el. paštas arba slaptažodis!',
//                     formData: { email }
//                 });
//             }

//             // Tikriname slaptažodį
//             const isPasswordValid = await user.comparePassword(password);
//             if (!isPasswordValid) {
//                 console.log('Neteisingas slaptažodis vartotojui:', email);
//                 return res.render('loginPage', {
//                     title: 'Prisijungti',
//                     error: 'Neteisingas el. paštas arba slaptažodis!',
//                     formData: { email }
//                 });
//             }

//             // Generuojame JWT token
//             const token = jwtService.generateUserToken(user);

//             // Išsaugome vartotojo duomenis sesijoje
//             req.session.user = {
//                 id: user._id,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 email: user.email,
//                 token: token
//             };

//             // Nustatome cookie
//             res.cookie('auth_token', token, {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production',
//                 maxAge: 24 * 60 * 60 * 1000
//             });

//             console.log('Sėkmingas prisijungimas:', email);

//             // Jei API užklausa, grąžiname token
//             if (req.xhr || req.headers.accept.indexOf('json') > -1) {
//                 return res.json({
//                     success: true,
//                     token: token,
//                     user: {
//                         id: user._id,
//                         firstName: user.firstName,
//                         lastName: user.lastName,
//                         email: user.email
//                     }
//                 });
//             }

//             res.redirect('/?success=Sėkmingai prisijungėte!');

//         } catch (error) {
//             console.error('Prisijungimo klaida:', error);
//             res.render('loginPage', {
//                 title: 'Prisijungti',
//                 error: 'Įvyko klaida prisijungiant. Bandykite dar kartą.',
//                 formData: { email: req.body.email }
//             });
//         }
//     }

//     // GET /logout
//     logout(req, res) {
//         req.session.destroy((err) => {
//             if (err) {
//                 console.error('Klaida atsijungiant:', err);
//             }
//         });

//         // Išvalome cookie
//         res.clearCookie('auth_token');
//         res.clearCookie('connect.sid'); // Sesijos cookie

//         res.redirect('/?message=Sėkmingai atsijungėte');
//     }

//     // API endpoint token gavimui
//     async getToken(req, res) {
//         try {
//             const { email, password } = req.body;

//             if (!email || !password) {
//                 return res.status(400).json({ error: 'El. paštas ir slaptažodis yra privalomi' });
//             }

//             const user = await User.findOne({ email: email.toLowerCase() });
//             if (!user) {
//                 return res.status(401).json({ error: 'Neteisingas el. paštas arba slaptažodis' });
//             }

//             const isPasswordValid = await user.comparePassword(password);
//             if (!isPasswordValid) {
//                 return res.status(401).json({ error: 'Neteisingas el. paštas arba slaptažodis' });
//             }

//             const token = jwtService.generateUserToken(user);

//             res.json({
//                 success: true,
//                 token: token,
//                 user: {
//                     id: user._id,
//                     firstName: user.firstName,
//                     lastName: user.lastName,
//                     email: user.email
//                 }
//             });

//         } catch (error) {
//             console.error('Token gavimo klaida:', error);
//             res.status(500).json({ error: 'Įvyko serverio klaida' });
//         }
//     }

//     // Token patikrinimo endpoint
//     verifyToken(req, res) {
//         try {
//             const token = req.body.token || req.query.token;
            
//             if (!token) {
//                 return res.status(400).json({ error: 'Token yra privalomas' });
//             }

//             const decoded = jwtService.verifyToken(token);
//             res.json({
//                 valid: true,
//                 user: decoded
//             });

//         } catch (error) {
//             res.json({
//                 valid: false,
//                 error: error.message
//             });
//         }
//     }
// }

// module.exports = AuthController;