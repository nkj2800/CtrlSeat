import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const connectDatabase = () => {

  let DB_URI = ''

  if (process.env.NODE_ENV === 'DEVELOPMENT') DB_URI = process.env.DB_LOCAL_URI
  if (process.env.NODE_ENV === 'PRODUCTION') DB_URI = process.env.DB_URI

  if (!DB_URI) {
    console.error('MongoDB connection string is undefined. Please check your environment variables.');
    process.exit(1);
  }

  mongoose.connection.on('error', err => {
    console.error('Mongoose connection error:', err);
  });

  mongoose.connect(DB_URI)
    .then(() => {
      console.log(`MongoDB database connected with HOST: ${mongoose?.connection?.host}`)
    })
}