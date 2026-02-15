import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from '@/utils/logger';

let io: Server | null = null;

export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`🔌 Socket connected: ${socket.id}`);

    // Join rooms based on user role (optional)
    socket.on('join:dashboard', () => {
      socket.join('dashboard');
      logger.debug(`Socket ${socket.id} joined dashboard room`);
    });

    // Join user-specific room for per-account real-time events
    socket.on('join:user', (userId: string) => {
      if (userId) {
        socket.join(`user:${userId}`);
        logger.debug(`Socket ${socket.id} joined user room: user:${userId}`);
      }
    });

    socket.on('disconnect', (reason: string) => {
      logger.info(`🔌 Socket disconnected: ${socket.id} (${reason})`);
    });

    socket.on('error', (error: Error) => {
      logger.error(`Socket error for ${socket.id}:`, error);
    });
  });

  logger.info('✅ Socket.IO server initialized');
  return io;
};

export const getIO = (): Server | null => {
  return io;
};

// Helper to emit events to all dashboard users
export const emitToDashboard = (event: string, data: any): void => {
  if (io) {
    io.to('dashboard').emit(event, data);
    // Also emit to all connected clients (fallback if not in room)
    io.emit(event, data);
  }
};

// Helper to emit events to a specific user's room
export const emitToUser = (userId: string, event: string, data: any): void => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

export default { initializeSocket, getIO, emitToDashboard, emitToUser };
