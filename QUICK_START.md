# 🚀 Quick Start Guide - Real Google OAuth

## **Step 1: Setup Google OAuth (5 minutes)**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create Project** → Enable Google+ API
3. **Create OAuth 2.0 Credentials**:
   - Redirect URI: `http://localhost:5000/api/auth/google/callback`
   - JavaScript Origin: `http://localhost:3000`
4. **Copy Client ID & Secret**

## **Step 2: Configure Environment**

Create `server/.env`:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret
```

## **Step 3: Start Servers**

**Terminal 1 - Backend:**
```bash
cd server
npm run oauth
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

## **Step 4: Test Real Google Login**

1. Visit `http://localhost:3000`
2. Click "Sign in with Google"
3. Complete Google OAuth
4. See your real Google profile data! 🎉

## **🎯 What You'll Get:**

✅ **Real Google Authentication**  
✅ **Your Actual Profile Photo**  
✅ **Your Real Name & Email**  
✅ **Secure JWT Sessions**  
✅ **Real Contact Form Data**  

**Ready to test with your real Google account! 🚀**
