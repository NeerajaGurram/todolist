import mongoose from 'mongoose';


const connectDB = async () => {
  const MONGODB_URI=process.env.MONGODB_URI;
  try {
    await mongoose.connect(MONGODB_URI || "mongodb+srv://neerajagurram777:YRpF4T5bCv69Vubi@cluster0.79hfu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default connectDB;
