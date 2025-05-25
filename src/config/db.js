import mongoose from 'mongoose';

const connectDB = async()=>{
    try{
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/task-management';
        await mongoose.connect(uri);
        console.log('MongoDb connected successfully');
    }
    catch(err){
        console.error('MongoDB connection failed:', err.message);
        process.exit(1); // Exit process with failure
    }
}
export default connectDB;