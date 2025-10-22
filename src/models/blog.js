const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Pamokos pavadinimas yra privalomas'],
    },
    santrauka: {
        type: String,
        required: [true, 'Santrauka yra privaloma'],
    },
    body: {
        type: String,
        required: [true, 'Pamokos turinys yra privalomas']
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'naujienos'
});

module.exports = mongoose.model('naujienos', blogSchema);