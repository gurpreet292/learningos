const mongoose = require('mongoose');

const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learningos';

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully.');
    return true;
  } catch (error) {
    console.warn('MongoDB connection failed. Starting API without database connection:', error.message);
    return false;
  }
};

module.exports = { connectDatabase };
