// In Vercel, env vars are set via the dashboard, not .env files
// dotenv.config() is only needed for local development
import dotenv from 'dotenv';
dotenv.config();

import App from '../src/app';

// Create the Express app instance
const appInstance = new App();

// Initialize database connection (lazy, cached across invocations)
let isInitialized = false;
const ensureInitialized = async () => {
  if (!isInitialized) {
    await appInstance.initialize();
    isInitialized = true;
  }
};

// Vercel serverless handler
const handler = async (req: any, res: any) => {
  await ensureInitialized();
  return appInstance.app(req, res);
};

export default handler;
