const User = require('../src/models/User');  // Pridėk šią eilutę
class AuthController {
    getLoginPage(req, res) {
        res.render('loginPage', { 
            title: 'Prisijungti',
            error: req.query.error 
        });
    }

    getRegisterPage(req, res) {
        res.render('register', { 
            title: 'Registruotis',
            error: req.query.error 
        });
    }

    // POST /register
    async register(req, res) {
        try {
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
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.render('register', {
                    title: 'Registruotis',
                    error: 'Vartotojas su šiuo el. paštu jau egzistuoja!',
                    formData: { firstName, lastName, email }
                });
            }

            // Sukuriame naują vartotoją
            const newUser = new User({
                firstName,
                lastName,
                email,
                password
            });

            await newUser.save();

            // Po sėkmingos registracijos nukreipiame į prisijungimą
            res.redirect('/loginPage?success=Registracija sėkminga! Galite prisijungti.');

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
            const { email, password } = req.body;

            // Validacija
            if (!email || !password) {
                return res.render('loginPage', {
                    title: 'Prisijungti',
                    error: 'El. paštas ir slaptažodis yra privalomi!',
                    formData: { email }
                });
            }

            // Randame vartotoją
            const user = await User.findOne({ email });
            if (!user) {
                return res.render('loginPage', {
                    title: 'Prisijungti',
                    error: 'Neteisingas el. paštas arba slaptažodis!',
                    formData: { email }
                });
            }

            // Tikriname slaptažodį
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.render('loginPage', {
                    title: 'Prisijungti',
                    error: 'Neteisingas el. paštas arba slaptažodis!',
                    formData: { email }
                });
            }

            // Čia galėtumėte pridėti sesijos valdymą
            // req.session.userId = user._id;
            
            // Laikinas sprendimas - nukreipiame į pagrindinį puslapį
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
        // Čia galėtumėte sunaikinti sesiją
        // req.session.destroy();
        res.redirect('/?message=Sėkmingai atsijungėte');
    }
}

module.exports = AuthController;