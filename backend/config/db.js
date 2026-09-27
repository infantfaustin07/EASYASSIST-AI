import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️  No MONGODB_URI configured. Running with built-in persistent local store.');
    isMongoConnected = false;
    return false;
  }

  try {
    // Attempt connection with a 3.5s server selection timeout so local startup is fast
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3500,
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB connected successfully to ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  MongoDB connection failed (${error.message}).`);
    console.log('ℹ️  Automatically falling back to built-in persistent local store. App is 100% operational!');
    isMongoConnected = false;
    return false;
  }
};

export const getDBStatus = () => ({
  isMongoConnected,
  database: isMongoConnected ? mongoose.connection.name : 'local-persistent-store',
  host: isMongoConnected ? mongoose.connection.host : 'local-memory-and-file',
});
