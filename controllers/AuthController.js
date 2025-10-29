class AuthController {
    getLoginPage(req, res) {
        res.render('loginPage', { title: 'Prisijungti' });
    }

    getRegisterPage(req, res) {
        res.render('register', { title: 'Registruotis' });
    }
}

module.exports = AuthController;