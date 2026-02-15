const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

// Environment variables (you'll need to set these)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret';
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-session-secret';
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());

// Session configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Here you would typically save/find the user in your database
    // For now, we'll use the profile data directly
    const user = {
      _id: profile.id,
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos[0].value,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize/deserialize user for session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Google OAuth server is running',
    timestamp: new Date().toISOString()
  });
});

// Custom authentication endpoints
const users = []; // In-memory user storage (replace with database in production)

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }
  
  // Create new user
  const newUser = {
    _id: 'user-' + Date.now(),
    name,
    email,
    password, // In production, hash this password
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: newUser._id,
      email: newUser.email 
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
  
  res.json({
    success: true,
    message: 'Registration successful',
    token,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
  
  // Check password (in production, compare hashed passwords)
  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user._id,
      email: user.email 
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
  
  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
});

// Google OAuth endpoints
app.get('/api/auth/google', passport.authenticate('google'));

app.get('/api/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: req.user._id,
        email: req.user.email 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    // Set HTTP-only cookie
    res.cookie('jwt_token', token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    // Redirect to frontend with success
    res.redirect('http://localhost:3000/auth-success');
  }
);

// Get current user endpoint
app.get('/api/auth/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
  
  res.json({
    success: true,
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt
    }
  });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    
    res.clearCookie('jwt_token');
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

// Contact form endpoint (real data storage)
const contacts = []; // In-memory storage (replace with database in production)

app.post('/api/contact', (req, res) => {
  const contact = {
    _id: 'contact-' + Date.now(),
    ...req.body,
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  contacts.push(contact);
  
  res.json({
    success: true,
    message: 'Contact form submitted successfully',
    data: contact
  });
});

// Get all contacts
app.get('/api/contact', (req, res) => {
  res.json({
    success: true,
    data: contacts
  });
});

// Contact stats endpoint
app.get('/api/contact/stats', (req, res) => {
  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    read: contacts.filter(c => c.status === 'read').length,
    replied: contacts.filter(c => c.status === 'replied').length,
    archived: contacts.filter(c => c.status === 'archived').length,
    last30Days: contacts.filter(c => {
      const createdAt = new Date(c.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdAt > thirtyDaysAgo;
    }).length
  };
  
  res.json({
    success: true,
    data: stats
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Google OAuth Server running on port ${PORT}`);
  console.log('📊 Health check: http://localhost:' + PORT + '/health');
  console.log('🔗 Google OAuth: http://localhost:' + PORT + '/api/auth/google');
  console.log('⚠️  Make sure to set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables!');
});
