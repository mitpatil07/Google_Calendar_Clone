import mongoose from 'mongoose';


const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Connection options for production reliability
    const options: mongoose.ConnectOptions = {
      // Automatically build indexes (disable in production for performance)
      autoIndex: process.env.NODE_ENV !== 'production',
    };

    const conn = await mongoose.connect(mongoURI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);

    // Graceful shutdown handling
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    // Exit with failure code
    process.exit(1);
  }
};


mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

export default connectDB;