const User = require('../src/models/User');

class AuthController {
    getLoginPage(req, res) {
        if (req.session.user) {
            return res.redirect('/');
        }
        
        res.render('loginPage', { 
            title: 'Prisijungti',
            error: req.query.error,
            success: req.query.success
        });
    }

    getRegisterPage(req, res) {
        if (req.session.user) {
            return res.redirect('/');
        }
        
        res.render('register', { 
            title: 'Registruotis',
            error: req.query.error,
            success: req.query.success
        });
    }

    // POST /register
    async register(req, res) {
        try {
            // Jei jau prisijungęs, nukreipiame į pagrindinį puslapį
            if (req.session.user) {
                return res.redirect('/');
            }

            console.log('Registracijos bandymas:', req.body);
            const { firstName, lastName, email, password } = req.body;

            // Validacija
            if (!firstName || !lastName || !email || !password) {
                return res.render('register', {
                    title: 'Registruotis',
                    error: 'Visi laukai yra privalomi!',
                    formData: { firstName, lastName, email }
                });
            }

            if (password.length < 6) {
                return res.render('register', {
                    title: 'Registruotis',
                    error: 'Slaptažodis turi būti bent 6 simbolių ilgio!',
                    formData: { firstName, lastName, email }
                });
            }

            // Tikriname ar vartotojas jau egzistuoja
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.render('register', {
                    title: 'Registruotis',
                    error: 'Vartotojas su šiuo el. paštu jau egzistuoja!',
                    formData: { firstName, lastName, email }
                });
            }

            // Sukuriame naują vartotoją
            const newUser = new User({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.toLowerCase().trim(),
                password
            });

            await newUser.save();
            console.log('Naujas vartotojas sukurtas:', newUser.email);

            // Automatiškai prisijungiame po registracijos
            req.session.user = {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email
            };

            res.redirect('/?success=Registracija sėkminga! Esate prisijungęs.');

        } catch (error) {
            console.error('Registracijos klaida:', error);
            
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                return res.render('register', {
                    title: 'Registruotis',
                    error: errors.join(', '),
                    formData: req.body
                });
            }

            res.render('register', {
                title: 'Registruotis',
                error: 'Įvyko klaida registruojant. Bandykite dar kartą.',
                formData: req.body
            });
        }
    }

    // POST /loginPage
    async login(req, res) {
        try {
            // Jei jau prisijungęs, nukreipiame į pagrindinį puslapį
            if (req.session.user) {
                return res.redirect('/');
            }

            const { email, password } = req.body;
            console.log('Prisijungimo bandymas:', email);

            // Validacija
            if (!email || !password) {
                return res.render('loginPage', {
                    title: 'Prisijungti',
                    error: 'El. paštas ir slaptažodis yra privalomi!',
                    formData: { email }
                });
            }

            // Randame vartotoją
            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                console.log('Vartotojas nerastas:', email);
                return res.render('loginPage', {
                    title: 'Prisijungti',
                    error: 'Neteisingas el. paštas arba slaptažodis!',
                    formData: { email }
                });
            }

            // Tikriname slaptažodį
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                console.log('Neteisingas slaptažodis vartotojui:', email);
                return res.render('loginPage', {
                    title: 'Prisijungti',
                    error: 'Neteisingas el. paštas arba slaptažodis!',
                    formData: { email }
                });
            }

            // Išsaugome vartotojo duomenis sesijoje
            req.session.user = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            };

            console.log('Sėkmingas prisijungimas:', email);
            res.redirect('/?success=Sėkmingai prisijungėte!');

        } catch (error) {
            console.error('Prisijungimo klaida:', error);
            res.render('loginPage', {
                title: 'Prisijungti',
                error: 'Įvyko klaida prisijungiant. Bandykite dar kartą.',
                formData: { email: req.body.email }
            });
        }
    }

    // GET /logout
    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Klaida atsijungiant:', err);
            }
            res.redirect('/?message=Sėkmingai atsijungėte');
        });
    }
}

module.exports = AuthController;