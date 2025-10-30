const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Vardas yra privalomas'],
        trim: true,
        minlength: [2, 'Vardas turi būti bent 2 simbolių ilgio']
    },
    lastName: {
        type: String,
        required: [true, 'Pavardė yra privaloma'],
        trim: true,
        minlength: [2, 'Pavardė turi būti bent 2 simbolių ilgio']
    },
    email: {
        type: String,
        required: [true, 'El. paštas yra privalomas'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Įveskite teisingą el. paštą']
    },
    password: {
        type: String,
        required: [true, 'Slaptažodis yra privalomas'],
        minlength: [6, 'Slaptažodis turi būti bent 6 simbolių ilgio']
    }
}, {
    timestamps: true,
    collection: 'users'
});

// Šifruojame slaptažodį prieš išsaugant
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Metodas slaptažodžiui patikrinti
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);