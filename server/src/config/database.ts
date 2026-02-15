import mongoose from 'mongoose';
import { logger } from '@/utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    };

    const conn = await mongoose.connect(mongoUri, options);

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Clean up stale indexes that don't match the current schema
    try {
      const usersCollection = conn.connection.collection('users');
      const indexes = await usersCollection.indexes();
      const staleIndexes = indexes.filter((idx: any) =>
        idx.name !== '_id_' && idx.key && ('username' in idx.key)
      );
      for (const idx of staleIndexes) {
        if (idx.name) {
          logger.info(`Dropping stale index: ${idx.name}`);
          await usersCollection.dropIndex(idx.name);
        }
      }
    } catch (indexError) {
      logger.warn('Could not clean stale indexes:', indexError);
    }
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      logger.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('🔄 MongoDB reconnected');
    });

  } catch (error) {
    logger.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('✅ MongoDB connection closed');
  } catch (error) {
    logger.error('❌ Error closing MongoDB connection:', error);
  }
};

// Graceful shutdown (only in non-serverless environments)
if (process.env.VERCEL !== '1') {
  process.on('SIGTERM', async () => {
    logger.info('🔄 SIGTERM received, closing MongoDB connection...');
    await disconnectDatabase();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.info('🔄 SIGINT received, closing MongoDB connection...');
    await disconnectDatabase();
    process.exit(0);
  });
}
