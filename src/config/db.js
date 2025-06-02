import mongoose from 'mongoose';


const connectDB = async () => {
  try {
    // Sử dụng biến môi trường hoặc fallback vào MongoDB địa phương
    const mongoURI = process.env.MONGO_URI || 'mongodb://user:password@127.0.0.1:27019/TaskManagement?authSource=admin';

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  }
};


export default connectDB;
// mongodb://user:password@127.0.0.1:27019/S-Mongo?authSource=admin