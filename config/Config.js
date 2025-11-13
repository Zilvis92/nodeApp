const Config = {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h', // Token galiojimo laikas
    issuer: 'naujienu-portalas',
    audience: 'naujienu-portalas-users'
};

module.exports = Config;