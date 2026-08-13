const mongoose = require('mongoose');

let isConnectedToMongo = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000, // Quick timeout fallback if local mongo is off
    });
    isConnectedToMongo = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnectedToMongo = false;
    console.warn(`[Database Warning] Could not connect to MongoDB server (${error.message}).`);
    console.log(`[Database Notice] Application is running in IN-MEMORY storage mode. All CRUD operations will function normally in memory!`);
  }
};

const getIsConnected = () => isConnectedToMongo;

module.exports = { connectDB, getIsConnected };
