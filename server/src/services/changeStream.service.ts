import mongoose from 'mongoose';
import { Contact } from '@/models/Contact.model';
import { emitToDashboard } from '@/config/socket';
import { logger } from '@/utils/logger';

let changeStream: mongoose.mongo.ChangeStream | null = null;

export const initializeChangeStreams = (): void => {
  try {
    // Only initialize if connected to a replica set (MongoDB Atlas always is)
    const connection = mongoose.connection;
    
    if (connection.readyState !== 1) {
      logger.warn('⚠️ Database not connected, skipping Change Streams initialization');
      return;
    }

    // Watch the contacts collection for changes
    changeStream = Contact.watch([], { 
      fullDocument: 'updateLookup' 
    });

    changeStream.on('change', (change: any) => {
      logger.debug(`📡 Change Stream event: ${change.operationType}`, {
        collection: 'contacts',
        operationType: change.operationType,
        documentId: change.documentKey?._id
      });

      switch (change.operationType) {
        case 'insert':
          emitToDashboard('contact:created', {
            type: 'created',
            contact: change.fullDocument,
            timestamp: new Date().toISOString()
          });
          logger.info(`📡 Real-time: New contact created - ${change.fullDocument?.name}`);
          break;

        case 'update':
        case 'replace':
          emitToDashboard('contact:updated', {
            type: 'updated',
            contact: change.fullDocument,
            updatedFields: change.updateDescription?.updatedFields,
            timestamp: new Date().toISOString()
          });
          logger.info(`📡 Real-time: Contact updated - ${change.documentKey?._id}`);
          break;

        case 'delete':
          emitToDashboard('contact:deleted', {
            type: 'deleted',
            contactId: change.documentKey?._id?.toString(),
            timestamp: new Date().toISOString()
          });
          logger.info(`📡 Real-time: Contact deleted - ${change.documentKey?._id}`);
          break;

        default:
          logger.debug(`📡 Unhandled change type: ${change.operationType}`);
      }
    });

    changeStream.on('error', (error: Error) => {
      logger.error('❌ Change Stream error:', error);
      // Attempt to restart after a delay
      setTimeout(() => {
        logger.info('🔄 Attempting to restart Change Stream...');
        closeChangeStreams();
        initializeChangeStreams();
      }, 5000);
    });

    changeStream.on('close', () => {
      logger.warn('⚠️ Change Stream closed');
    });

    logger.info('✅ MongoDB Change Streams initialized for contacts collection');

  } catch (error: any) {
    // Change Streams require replica set — log a warning instead of crashing
    if (error.message?.includes('replica set') || error.code === 40573) {
      logger.warn('⚠️ MongoDB Change Streams require a replica set. Real-time updates via Change Streams are disabled.');
      logger.warn('   Use MongoDB Atlas or configure a local replica set to enable Change Streams.');
    } else {
      logger.error('❌ Failed to initialize Change Streams:', error);
    }
  }
};

export const closeChangeStreams = (): void => {
  if (changeStream) {
    changeStream.close();
    changeStream = null;
    logger.info('✅ Change Streams closed');
  }
};

export default { initializeChangeStreams, closeChangeStreams };
