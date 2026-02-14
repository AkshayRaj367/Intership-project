const express = require('express');

const app = express();

// Basic middleware
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Mock Google OAuth endpoint for testing
app.get('/api/auth/google', (req, res) => {
  // This is a mock redirect - in production, this would redirect to actual Google OAuth
  res.json({
    success: true,
    message: 'Google OAuth endpoint - This would redirect to Google OAuth in production',
    redirect_url: 'https://accounts.google.com/oauth/authorize?mock=true'
  });
});

// Mock auth endpoints - FIXED PATHS
app.post('/api/auth/google', (req, res) => {
  res.json({
    success: true,
    message: 'Mock Google OAuth callback',
    user: {
      id: 'mock-user-id',
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'https://via.placeholder.com/150'
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 'mock-user-id',
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'https://via.placeholder.com/150'
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.json({
    success: true,
    message: 'Contact form submitted successfully',
    data: {
      id: 'contact-' + Date.now(),
      ...req.body,
      status: 'new',
      createdAt: new Date().toISOString()
    }
  });
});

// Get all contacts
app.get('/api/contact', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'contact-1',
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'general',
        message: 'This is a test message',
        status: 'new',
        createdAt: new Date().toISOString()
      },
      {
        id: 'contact-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'demo',
        message: 'I would like to request a demo',
        status: 'read',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  });
});

// Contact stats endpoint
app.get('/api/contact/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      total: 2,
      new: 1,
      replied: 1,
      last30Days: 2
    }
  });
});

// Update contact status
app.patch('/api/contact/:id/status', (req, res) => {
  const { status } = req.body;
  res.json({
    success: true,
    data: {
      id: req.params.id,
      status: status,
      updatedAt: new Date().toISOString()
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('📊 Health check: http://localhost:' + PORT + '/health');
  console.log('🔗 API endpoint: http://localhost:' + PORT + '/api');
  console.log('✅ Mock Google OAuth: http://localhost:' + PORT + '/api/auth/google');
  console.log('👤 Auth endpoints: /api/auth/me, /api/auth/logout');
});
