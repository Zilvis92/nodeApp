const jwtConfig = {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: '24h', // Token galiojimo laikas
    issuer: 'naujienu-portalas',
    audience: 'naujienu-portalas-users'
};

module.exports = jwtConfig;