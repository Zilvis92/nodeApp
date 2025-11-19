const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('🔗 Bandome prisijungti prie MongoDB...');
        
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI nerastas .env faile');
        }
        
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         console.log('🔗 Bandome prisijungti prie MongoDB...');
//         const conn = await mongoose.connect('mongodb+srv://blinovaszilvinas_db_user:cZ673eaS9Cr8DbX2@cluster0.rx3qcov.mongodb.net/naujienu_portalas?retryWrites=true&w=majority&appName=Cluster0');
//         console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.error('Database connection error:', error);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;