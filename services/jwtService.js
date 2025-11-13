const jwt = require('jsonwebtoken');
const Config = require('../config/Config');

class JwtService {
    // Generuoti JWT token
    generateToken(payload) {
        return jwt.sign(payload, Config.secret, {
            // user ID isideti kai atsikirinesiu frontend nuo backend
            expiresIn: Config.expiresIn,
            issuer: Config.issuer,
            audience: Config.audience
        });
    }

    // Tikrinti JWT token
    verifyToken(token) {
        try {
            return jwt.verify(token, Config.secret, {
                // user ID isideti
                issuer: Config.issuer,
                audience: Config.audience
            });
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    // Dekoduoti token be patikrinimo (tik skaitymui)
    decodeToken(token) {
        return jwt.decode(token);
    }

    // Generuoti token vartotojo duomenims
    generateUserToken(user) {
        const payload = {
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName
        };
        
        return this.generateToken(payload);
    }
}

module.exports = new JwtService();