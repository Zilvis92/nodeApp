const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

class JwtService {
    // Generuoti JWT token
    generateToken(payload) {
        return jwt.sign(payload, jwtConfig.secret, {
            expiresIn: jwtConfig.expiresIn,
            issuer: jwtConfig.issuer,
            audience: jwtConfig.audience
        });
    }

    // Tikrinti JWT token
    verifyToken(token) {
        try {
            return jwt.verify(token, jwtConfig.secret, {
                issuer: jwtConfig.issuer,
                audience: jwtConfig.audience
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
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        };
        
        return this.generateToken(payload);
    }
}

module.exports = new JwtService();