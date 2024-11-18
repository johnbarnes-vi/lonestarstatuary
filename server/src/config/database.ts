// src/config/database.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Database connection options
 */
const dbOptions: mongoose.ConnectOptions = {
  // Will automatically attempt to reconnect on connection loss
  autoCreate: true,
  // Automatically try to reconnect when it loses connection
  autoIndex: true,
};

/**
 * Establishes connection to MongoDB
 * @throws {Error} If connection fails
 */
export const connectDatabase = async (): Promise<void> => {
  const dbUri = process.env.MONGODB_URI;
  
  if (!dbUri) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  try {
    await mongoose.connect(dbUri, dbOptions);
    console.log('Successfully connected to MongoDB.');

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully.');
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit if we can't connect to the database
  }
};

/**
 * Closes database connection
 * Useful for graceful shutdowns and testing
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Successfully disconnected from MongoDB.');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
};