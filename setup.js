#!/usr/bin/env node

/**
 * ╔══════════════════════════════════════════════╗
 * ║       TechFlow - Interactive Setup Script     ║
 * ║   Automates environment setup for new devs    ║
 * ╚══════════════════════════════════════════════╝
 *
 * Usage:  node setup.js
 *
 * This script will:
 *  1. Check Node.js and npm versions
 *  2. Create .env files from .env.example templates
 *  3. Prompt for required configuration values
 *  4. Install dependencies for both client and server
 *  5. Optionally start both development servers
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ─── Helpers ──────────────────────────────────────────────────

const ROOT = __dirname;
const SERVER_DIR = path.join(ROOT, 'server');
const CLIENT_DIR = path.join(ROOT, 'client');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question, defaultVal = '') {
  const suffix = defaultVal ? ` (${defaultVal})` : '';
  return new Promise((resolve) => {
    rl.question(`  ${question}${suffix}: `, (answer) => {
      resolve(answer.trim() || defaultVal);
    });
  });
}

function askYesNo(question, defaultYes = true) {
  const hint = defaultYes ? 'Y/n' : 'y/N';
  return new Promise((resolve) => {
    rl.question(`  ${question} [${hint}]: `, (answer) => {
      const a = answer.trim().toLowerCase();
      if (a === '') resolve(defaultYes);
      else resolve(a === 'y' || a === 'yes');
    });
  });
}

function heading(text) {
  console.log('\n' + '═'.repeat(50));
  console.log(`  ${text}`);
  console.log('═'.repeat(50));
}

function success(msg) { console.log(`  ✅ ${msg}`); }
function info(msg)    { console.log(`  ℹ️  ${msg}`); }
function warn(msg)    { console.log(`  ⚠️  ${msg}`); }
function fail(msg)    { console.log(`  ❌ ${msg}`); }

function run(cmd, cwd = ROOT) {
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function generateRandomString(length = 48) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ─── Steps ────────────────────────────────────────────────────

async function checkPrerequisites() {
  heading('Step 1 · Checking Prerequisites');

  // Node.js version
  try {
    const nodeVersion = execSync('node -v', { encoding: 'utf-8' }).trim();
    const major = parseInt(nodeVersion.replace('v', '').split('.')[0], 10);
    if (major < 16) {
      fail(`Node.js ${nodeVersion} detected. Version 16+ required.`);
      process.exit(1);
    }
    success(`Node.js ${nodeVersion}`);
  } catch {
    fail('Node.js is not installed. Download from https://nodejs.org');
    process.exit(1);
  }

  // npm version
  try {
    const npmVersion = execSync('npm -v', { encoding: 'utf-8' }).trim();
    success(`npm v${npmVersion}`);
  } catch {
    fail('npm is not installed.');
    process.exit(1);
  }

  // Check project structure
  if (!fs.existsSync(SERVER_DIR)) {
    fail('server/ directory not found. Make sure you are in the project root.');
    process.exit(1);
  }
  if (!fs.existsSync(CLIENT_DIR)) {
    fail('client/ directory not found. Make sure you are in the project root.');
    process.exit(1);
  }
  success('Project structure verified');
}

async function setupServerEnv() {
  heading('Step 2 · Server Environment Configuration');

  const envPath = path.join(SERVER_DIR, '.env');
  if (fs.existsSync(envPath)) {
    const overwrite = await askYesNo('server/.env already exists. Overwrite?', false);
    if (!overwrite) {
      info('Keeping existing server/.env');
      return;
    }
  }

  console.log('\n  Enter your configuration values (press Enter for defaults):\n');

  // MongoDB
  const mongoUri = await ask(
    'MongoDB URI',
    'mongodb://localhost:27017/techflow'
  );

  // JWT
  const jwtSecret = generateRandomString(48);
  const jwtRefreshSecret = generateRandomString(48);
  const sessionSecret = generateRandomString(48);
  info(`JWT secrets auto-generated (${jwtSecret.substring(0, 12)}...)`);

  // Google OAuth
  const configureGoogle = await askYesNo('Configure Google OAuth?', false);
  let googleClientId = '';
  let googleClientSecret = '';
  let googleCallbackUrl = 'http://localhost:5000/api/auth/google/callback';
  if (configureGoogle) {
    googleClientId = await ask('Google Client ID');
    googleClientSecret = await ask('Google Client Secret');
    googleCallbackUrl = await ask(
      'Google Callback URL',
      'http://localhost:5000/api/auth/google/callback'
    );
  }

  // Email
  const configureEmail = await askYesNo('Configure Email notifications (Gmail)?', false);
  let emailUser = '';
  let emailPass = '';
  if (configureEmail) {
    emailUser = await ask('Gmail address');
    emailPass = await ask('Gmail App Password');
  }

  // Client URL
  const clientUrl = await ask('Client URL', 'http://localhost:3000');

  const envContent = `# ══════════════════════════════════════════════
# TechFlow Server — Environment Configuration
# Generated by setup.js on ${new Date().toISOString()}
# ══════════════════════════════════════════════

# Environment
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=${mongoUri}

# JWT Authentication
JWT_SECRET=${jwtSecret}
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=${jwtRefreshSecret}
JWT_REFRESH_EXPIRE=30d

# Google OAuth
GOOGLE_CLIENT_ID=${googleClientId}
GOOGLE_CLIENT_SECRET=${googleClientSecret}
GOOGLE_CALLBACK_URL=${googleCallbackUrl}

# Email (Gmail SMTP)
EMAIL_USER=${emailUser}
EMAIL_APP_PASS=${emailPass}
EMAIL_FROM_NAME=TechFlow

# Frontend URL
CLIENT_URL=${clientUrl}
CORS_ORIGIN=${clientUrl}

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=12
SESSION_SECRET=${sessionSecret}

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
`;

  fs.writeFileSync(envPath, envContent);
  success('server/.env created');
}

async function setupClientEnv() {
  heading('Step 3 · Client Environment Configuration');

  const envPath = path.join(CLIENT_DIR, '.env');
  if (fs.existsSync(envPath)) {
    const overwrite = await askYesNo('client/.env already exists. Overwrite?', false);
    if (!overwrite) {
      info('Keeping existing client/.env');
      return;
    }
  }

  const apiUrl = await ask('Server API URL', 'http://localhost:5000/api');
  const socketUrl = await ask(
    'Socket.IO URL (leave empty to skip)',
    'http://localhost:5000'
  );

  const envContent = `# ══════════════════════════════════════════════
# TechFlow Client — Environment Configuration
# Generated by setup.js on ${new Date().toISOString()}
# ══════════════════════════════════════════════

# API
VITE_API_URL=${apiUrl}
${socketUrl ? `VITE_SOCKET_URL=${socketUrl}` : '# VITE_SOCKET_URL=http://localhost:5000'}

# Environment
VITE_NODE_ENV=development

# App Info
VITE_APP_NAME=TechFlow
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_SENTRY=false
`;

  fs.writeFileSync(envPath, envContent);
  success('client/.env created');
}

async function installDependencies() {
  heading('Step 4 · Installing Dependencies');

  info('Installing server dependencies...');
  try {
    run('npm install', SERVER_DIR);
    success('Server dependencies installed');
  } catch (e) {
    fail('Failed to install server dependencies');
    console.error(e.message);
  }

  info('Installing client dependencies...');
  try {
    run('npm install', CLIENT_DIR);
    success('Client dependencies installed');
  } catch (e) {
    fail('Failed to install client dependencies');
    console.error(e.message);
  }
}

async function startDevServers() {
  heading('Step 5 · Start Development Servers');

  const startNow = await askYesNo('Start both dev servers now?', true);
  if (!startNow) {
    console.log('\n  To start manually:\n');
    console.log('    # Terminal 1 — Server (port 5000)');
    console.log('    cd server && npm run dev\n');
    console.log('    # Terminal 2 — Client (port 3000)');
    console.log('    cd client && npm run dev\n');
    return;
  }

  info('Starting server on port 5000...');
  const serverProc = spawn(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['run', 'dev'],
    { cwd: SERVER_DIR, stdio: 'pipe', shell: true }
  );
  serverProc.stdout.on('data', (data) => {
    process.stdout.write(`  [server] ${data}`);
  });
  serverProc.stderr.on('data', (data) => {
    process.stderr.write(`  [server] ${data}`);
  });

  // Wait a moment for server to start
  await new Promise((r) => setTimeout(r, 3000));

  info('Starting client on port 3000...');
  const clientProc = spawn(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['run', 'dev'],
    { cwd: CLIENT_DIR, stdio: 'pipe', shell: true }
  );
  clientProc.stdout.on('data', (data) => {
    process.stdout.write(`  [client] ${data}`);
  });
  clientProc.stderr.on('data', (data) => {
    process.stderr.write(`  [client] ${data}`);
  });

  console.log('\n  ─────────────────────────────────────────────');
  console.log('  🚀 Both servers are starting!');
  console.log('  📱 Client: http://localhost:3000');
  console.log('  ⚙️  Server: http://localhost:5000/api');
  console.log('  🏥 Health:  http://localhost:5000/api/health');
  console.log('  ─────────────────────────────────────────────');
  console.log('  Press Ctrl+C to stop both servers.\n');

  // Handle exit
  const cleanup = () => {
    serverProc.kill();
    clientProc.kill();
    process.exit(0);
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  // Keep the process alive
  await new Promise(() => {});
}

// ─── Main ─────────────────────────────────────────────────────

async function main() {
  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║                                                  ║
  ║     ████████╗███████╗ ██████╗██╗  ██╗            ║
  ║        ██╔══╝██╔════╝██╔════╝██║  ██║            ║
  ║        ██║   █████╗  ██║     ███████║            ║
  ║        ██║   ██╔══╝  ██║     ██╔══██║            ║
  ║        ██║   ███████╗╚██████╗██║  ██║            ║
  ║        ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝            ║
  ║                                                  ║
  ║          TechFlow Setup Wizard v1.0.0            ║
  ║          Contact Management Platform             ║
  ║                                                  ║
  ╚══════════════════════════════════════════════════╝
  `);

  try {
    await checkPrerequisites();
    await setupServerEnv();
    await setupClientEnv();
    await installDependencies();

    heading('Setup Complete!');
    console.log(`
  Your TechFlow development environment is ready!

  Project URLs (after starting):
    • Client:  http://localhost:3000
    • Server:  http://localhost:5000/api
    • Health:  http://localhost:5000/api/health

  Quick Commands:
    • cd server && npm run dev    — Start backend
    • cd client && npm run dev    — Start frontend
    • cd server && npm run build  — Build server for production
    • cd client && npm run build  — Build client for production
    `);

    await startDevServers();
  } catch (error) {
    fail(`Setup failed: ${error.message}`);
  } finally {
    rl.close();
  }
}

main();
