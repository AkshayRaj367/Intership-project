# Google OAuth Setup Guide

## 🚀 **Setup Real Google OAuth Authentication**

### **Step 1: Create Google OAuth Application**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select an existing one
3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Select "Web application"
   - Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
   - Add authorized JavaScript origin: `http://localhost:3000`

### **Step 2: Get Your Credentials**

After creating the OAuth app, you'll get:
- **Client ID**: `your-google-client-id`
- **Client Secret**: `your-google-client-secret`

### **Step 3: Set Environment Variables**

Create a `.env` file in the `server/` directory:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SESSION_SECRET=your-session-secret-here
JWT_SECRET=your-jwt-secret-here
```

### **Step 4: Install Required Packages**

```bash
cd server
npm install passport passport-google-oauth20 express-session cookie-parser jsonwebtoken cors
```

### **Step 5: Run the Server**

```bash
cd server
node google-oauth-server.js
```

### **Step 6: Test the Flow**

1. **Frontend**: `cd client && npm run dev`
2. **Backend**: `cd server && node google-oauth-server.js`
3. **Visit**: `http://localhost:3000`
4. **Click "Sign in with Google"**
5. **Complete Google OAuth flow**
6. **See your real Google profile data!**

## 🔧 **Environment Variables Explained**

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID | `123456789-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret | `GOCSPX-abc123def456` |
| `SESSION_SECRET` | Secret for session management | `your-secret-key-here` |
| `JWT_SECRET` | Secret for JWT token signing | `your-jwt-secret-here` |

## 🎯 **Features You'll Get**

✅ **Real Google Authentication** - Users sign in with their actual Google accounts  
✅ **Real Profile Data** - Name, email, and profile picture from Google  
✅ **Secure JWT Tokens** - HTTP-only cookies for security  
✅ **Real Contact Data** - Contact forms stored in memory (database in production)  
✅ **Session Management** - Proper login/logout functionality  
✅ **CORS Configuration** - Secure cross-origin requests  

## 🚨 **Important Notes**

- **Development Only**: This setup uses HTTP cookies (set `secure: false`)
- **Production**: Use HTTPS and set `secure: true` for cookies
- **Database**: Currently uses in-memory storage (replace with MongoDB/PostgreSQL)
- **Environment**: Never commit `.env` files to version control

## 🎊 **After Setup**

Once configured, your application will:
- Show real Google login screen
- Display actual user profile information
- Store real contact form submissions
- Provide secure authentication flow

**Ready to test with your real Google account! 🚀**
