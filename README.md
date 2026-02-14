# TechFlow - Enterprise Landing Page

A production-grade, scalable, maintainable full-stack product landing page built with modern technologies and enterprise best practices.

## 🚀 Features

### Core Features
- **Modern React Frontend**: Built with React 18, TypeScript, and Vite for optimal performance
- **Enterprise Backend**: Node.js + Express + TypeScript with comprehensive security middleware
- **Google OAuth 2.0**: Secure authentication with Passport.js and JWT httpOnly cookies
- **Contact Management**: Full CRUD operations with email notifications and admin dashboard
- **Responsive Design**: Mobile-first approach with Tailwind CSS and shadcn/ui components
- **Dark Mode**: System-aware theme switching with smooth transitions
- **Animations**: Framer Motion for engaging micro-interactions
- **SEO Optimized**: Meta tags, semantic HTML, and structured data

### Enterprise Features
- **Security**: Helmet, rate limiting, CORS, XSS protection, input sanitization
- **Logging**: Winston structured logging with file rotation and error tracking
- **Validation**: Joi/Zod schemas for request validation and type safety
- **Error Handling**: Comprehensive error boundaries and graceful degradation
- **Performance**: Code splitting, lazy loading, and optimized assets
- **Testing**: Jest + React Testing Library setup with coverage reporting
- **Code Quality**: ESLint + Prettier + Husky pre-commit hooks

## 🏗️ Architecture

```
techflow/
├── client/                 # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilities and API
│   │   └── types/        # TypeScript definitions
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Node.js + TypeScript Backend
│   ├── src/
│   │   ├── config/       # Database, auth, email config
│   │   ├── controllers/  # API route handlers
│   │   ├── middlewares/  # Auth, security, validation
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Helper functions
│   │   └── types/        # TypeScript definitions
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with hooks and concurrent features
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Fast build tool with HMR and optimization
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Framer Motion** - Production-ready animation library
- **React Router v6** - Declarative routing
- **TanStack Query** - Server state management
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation
- **Axios** - HTTP client with interceptors

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **Passport.js** - Authentication middleware
- **JWT** - Stateless authentication
- **Nodemailer** - Email service
- **Winston** - Structured logging
- **Joi** - Data validation

### DevOps
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **dotenv-safe** - Environment variable validation
- **Conventional Commits** - Standardized commit messages

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Google OAuth 2.0 credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/techflow.git
   cd techflow
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment setup**
   ```bash
   # Backend environment
   cd server
   cp .env.example .env
   # Edit .env with your credentials

   # Frontend environment
   cd ../client
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the application**
   ```bash
   # Start backend (port 5000)
   cd server
   npm run dev

   # Start frontend (port 3000) in new terminal
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

## 📝️ Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/techflow

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
SESSION_SECRET=your-session-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@techflow.com

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=development
VITE_APP_NAME=TechFlow
VITE_ENABLE_DARK_MODE=true
```

## 🧪 Testing

```bash
# Backend tests
cd server
npm test
npm run test:watch
npm run test:coverage

# Frontend tests
cd client
npm test
npm run test:watch
npm run test:coverage
```

## 📊 API Documentation

### Authentication Endpoints
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback

### Contact Endpoints
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (admin)
- `GET /api/contact/:id` - Get contact by ID (admin)
- `PATCH /api/contact/:id/status` - Update contact status (admin)
- `DELETE /api/contact/:id` - Delete contact (admin)
- `GET /api/contact/stats` - Get contact statistics (admin)
- `GET /api/contact/export` - Export contacts to CSV (admin)

### Utility Endpoints
- `GET /api/health` - Health check

## 🔒 Security Features

- **Authentication**: JWT with httpOnly cookies
- **Authorization**: Role-based access control
- **Rate Limiting**: Configurable request limits
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **XSS Protection**: Input sanitization
- **Input Validation**: Joi schemas
- **SQL Injection Prevention**: Mongoose ODM
- **CSRF Protection**: SameSite cookies

## 📈 Performance

- **Code Splitting**: Automatic with React.lazy
- **Tree Shaking**: Dead code elimination
- **Asset Optimization**: Image compression and caching
- **Database Indexing**: Optimized queries
- **Caching Strategy**: Redis for frequent data
- **CDN Ready**: Static asset delivery

## 🌐 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# Backend is ready for production
cd server
npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Configure production database URLs
- Set up SSL certificates
- Configure domain CORS origins
- Set up production email service

## 📝️ Development

### Code Style
- **ESLint**: Enforces consistent code style
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for quality
- **Conventional Commits**: Standardized commit messages

### Git Workflow
```bash
# Feature branch workflow
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Create pull request
```

## 🤝️ Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Vite](https://vitejs.dev/) - Build tool
- [shadcn/ui](https://ui.shadcn.com/) - Component library

## 📞 Support

For support, please email [support@techflow.com](mailto:support@techflow.com) or create an issue in the repository.

---

**Built with ❤️ using modern web technologies**
