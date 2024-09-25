const mongoose = require('mongoose');
const config = require('./config.json');

const connectDB = async () => {
    try {
        await mongoose.connect(config.connectionString);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
