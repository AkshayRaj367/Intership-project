# TechFlow — Project Report

**Full-Stack Contact Management Platform**

| Field        | Detail                                                    |
| ------------ | --------------------------------------------------------- |
| Project      | TechFlow — Contact Management Platform                    |
| Author       | Akshay Raj                                                |
| Assignment   | Web Development Internship                                |
| Version      | 1.0.0                                                     |
| Repository   | https://github.com/AkshayRaj367/Intership-project         |
| Live Client  | https://techflow367.vercel.app                            |
| Live API     | https://techflow-server-internship.onrender.com/api       |
| Date         | 2025                                                      |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Objectives](#2-objectives)
3. [Technology Choices & Justification](#3-technology-choices--justification)
4. [System Architecture](#4-system-architecture)
5. [Feature Breakdown](#5-feature-breakdown)
6. [Database Design](#6-database-design)
7. [Authentication System](#7-authentication-system)
8. [Real-Time Communication](#8-real-time-communication)
9. [Security Implementation](#9-security-implementation)
10. [API Documentation](#10-api-documentation)
11. [Frontend Implementation](#11-frontend-implementation)
12. [Deployment Strategy](#12-deployment-strategy)
13. [How to Use the Application](#13-how-to-use-the-application)
14. [Project Structure](#14-project-structure)
15. [Challenges & Solutions](#15-challenges--solutions)
16. [Future Enhancements](#16-future-enhancements)
17. [Conclusion](#17-conclusion)

---

## 1. Introduction

TechFlow is a full-stack web application built to demonstrate modern enterprise-grade development practices. It serves as a **contact management platform** where users can:

- Submit contact inquiries through a public-facing form
- Create an account (email/password or Google OAuth)
- View and manage their submitted contacts in a real-time dashboard
- Track contact status through a lifecycle (New → Read → Replied → Archived)
- Export contacts to CSV for external processing

The application showcases a complete development lifecycle — from a responsive frontend with smooth animations to a secure, scalable backend with real-time WebSocket communication, all deployed across cloud platforms using industry-standard practices.

---

## 2. Objectives

| # | Objective                          | Status |
|---|-------------------------------------|--------|
| 1 | Build a responsive React frontend   | ✅ Done |
| 2 | Implement secure REST API backend    | ✅ Done |
| 3 | Dual authentication (email + Google) | ✅ Done |
| 4 | Real-time updates via WebSockets     | ✅ Done |
| 5 | Per-user data isolation              | ✅ Done |
| 6 | CRUD operations with search/filter   | ✅ Done |
| 7 | CSV export functionality             | ✅ Done |
| 8 | Production deployment                | ✅ Done |
| 9 | Comprehensive security middleware    | ✅ Done |
| 10| Automated setup for developers      | ✅ Done |

---

## 3. Technology Choices & Justification

### Frontend

| Technology       | Why                                                                  |
| ---------------- | -------------------------------------------------------------------- |
| **React 18**     | Industry-standard UI library with a massive ecosystem, concurrent features, and excellent developer tooling. |
| **TypeScript**   | Adds static typing to catch bugs at compile time, improves IDE support, and provides self-documenting code. |
| **Vite 4.5**     | Ultra-fast build tool with Hot Module Replacement (HMR), significantly faster than Webpack for development. |
| **Tailwind CSS** | Utility-first CSS framework that eliminates context-switching between HTML and CSS files. Highly customizable. |
| **Framer Motion**| Production-ready animation library for React with declarative API and physics-based transitions. |
| **React Router** | De facto standard for client-side routing in React. Supports nested routes, lazy loading, and route guards. |
| **Zod + RHF**    | Zod provides TypeScript-first schema validation; React Hook Form delivers performant forms with minimal re-renders. |
| **Axios**        | Promise-based HTTP client with interceptors for global token management and error handling. |
| **Socket.IO Client** | Provides reliable WebSocket communication with automatic reconnection and fallback to polling. |

### Backend

| Technology       | Why                                                                  |
| ---------------- | -------------------------------------------------------------------- |
| **Express 4.18** | Most popular Node.js framework, mature ecosystem, middleware-based architecture. |
| **TypeScript**   | Same benefits as frontend — type safety, better refactoring, self-documenting APIs. |
| **Mongoose 8**   | Elegant MongoDB ODM with schema validation, middleware hooks, population, and TypeScript support. |
| **Passport.js**  | Modular authentication library supporting 500+ strategies. Used for both Google OAuth and JWT. |
| **Socket.IO**    | Battle-tested WebSocket library with rooms, namespaces, and automatic reconnection. |
| **Winston**      | Enterprise logging library with multiple transports (console, file), log levels, and formatting. |
| **bcryptjs**     | Pure JavaScript bcrypt implementation for secure password hashing without native dependencies. |
| **Helmet**       | Sets various HTTP headers to help protect against well-known web vulnerabilities. |

### Database

| Technology       | Why                                                                  |
| ---------------- | -------------------------------------------------------------------- |
| **MongoDB Atlas** | Cloud-hosted NoSQL database with free tier, built-in replication, and Change Streams for real-time data watching. Schema flexibility suits the evolving contact data model. |

### Deployment

| Technology       | Why                                                                  |
| ---------------- | -------------------------------------------------------------------- |
| **Vercel**       | Optimized for frontend frameworks (React/Vite), global CDN, automatic deployments from Git. |
| **Render**       | Supports persistent Node.js processes (required for Socket.IO), free tier, automatic deployments. |

---

## 4. System Architecture

The application follows a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                     PRESENTATION TIER                    │
│            React SPA hosted on Vercel (CDN)              │
│  Pages: Home · Login · Register · Dashboard              │
│  Communicates via: REST API (Axios) + WebSocket (Socket.IO) │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS + WSS
┌────────────────────────▼────────────────────────────────┐
│                      APPLICATION TIER                    │
│          Express API server hosted on Render             │
│  Security → Routes → Middleware → Controllers → Models   │
│  + Socket.IO server + Change Stream watcher              │
└────────────────────────┬────────────────────────────────┘
                         │ Mongoose
┌────────────────────────▼────────────────────────────────┐
│                        DATA TIER                         │
│               MongoDB Atlas (Cloud M0 Free)              │
│         Collections: users · contacts                    │
└─────────────────────────────────────────────────────────┘
```

### Request Lifecycle

1. Browser makes HTTP request to Express server
2. Request passes through the security middleware stack (Helmet, CORS, Rate Limiter, Mongo Sanitize, HPP)
3. Route handler matches the path and invokes the middleware chain
4. Auth middleware extracts and verifies JWT from the `Authorization` header
5. Validation middleware checks the request body/params against Joi schemas
6. Controller processes business logic, interacts with Mongoose models
7. Response sent back; Socket.IO event emitted if needed for real-time updates

---

## 5. Feature Breakdown

### 5.1 Landing Page (Public)

The home page consists of three animated sections:

- **Hero Section** — Welcoming headline, description of the platform, and "Get Started" / "View Dashboard" call-to-action buttons with Framer Motion entrance animations.
- **Features Section** — Card grid showcasing key capabilities (Real-Time Dashboard, Smart Contact Management, CSV Export, Multi-Auth, etc.) with scroll-triggered animations via `react-intersection-observer`.
- **Contact Form** — Interactive form with subject dropdown (General, Demo, Support, Partnership), real-time Zod validation, and success/error toast notifications via Sonner.

### 5.2 Authentication

- **Registration** — Name, email, password form with validation. Passwords hashed with bcrypt before storage.
- **Login** — Email/password authentication returning a JWT token.
- **Google OAuth** — One-click Google sign-in using Passport's Google OAuth 2.0 strategy. Handles both new and returning users.
- **Route Protection** — `ProtectedRoute` component wraps the Dashboard, redirecting unauthenticated users to Login.

### 5.3 Dashboard (Authenticated)

- **Statistics Cards** — Four cards at the top showing Total, New, Read, and Replied contact counts with animated counters.
- **Search & Filter** — Text search across contact name, email, and message body. Status filter dropdown (All, New, Read, Replied, Archived).
- **Contact Table** — Paginated list of contacts with status badges, timestamps, and action buttons.
- **Status Management** — Click to cycle through status: New → Read → Replied → Archived.
- **CSV Export** — One-click download of all contacts as a spreadsheet-compatible CSV file.
- **Connection Indicator** — Green/red badge showing real-time WebSocket connection status.
- **Delete** — Remove contacts with confirmation.

### 5.4 Real-Time Updates

When a contact is submitted, the dashboard updates instantly without page refresh via Socket.IO. If WebSocket is unavailable (e.g., Render free tier cold start), a 15-second HTTP polling fallback ensures data stays current.

---

## 6. Database Design

### Users Collection

```
{
  _id:        ObjectId       // Primary key
  email:      String         // Unique, lowercase, indexed
  password:   String         // bcrypt hash (excluded from queries by default)
  googleId:   String         // Google OAuth identifier (optional)
  name:       String         // Display name
  avatar:     String         // Profile picture URL (optional)
  role:       String         // "user" | "admin" (default: "user")
  isActive:   Boolean        // Account active flag (default: true)
  createdAt:  Date           // Auto-managed by Mongoose
  updatedAt:  Date           // Auto-managed by Mongoose
}
```

**Key features:**
- Password is excluded from queries via `select: false` to prevent accidental leaks
- `comparePassword()` instance method for secure login comparison
- `toSafeObject()` method strips sensitive fields before sending to client
- Auto-drops stale `username_1` index on database connection

### Contacts Collection

```
{
  _id:        ObjectId       // Primary key
  name:       String         // Submitter name
  email:      String         // Submitter email
  subject:    String         // "general" | "demo" | "support" | "partnership"
  message:    String         // Contact message body
  userId:     ObjectId       // Reference to Users (who submitted it)
  status:     String         // "new" | "read" | "replied" | "archived"
  isRead:     Boolean        // Read flag
  ipAddress:  String         // Submitter IP (for audit)
  userAgent:  String         // Submitter browser info (for audit)
  createdAt:  Date           // Auto-managed
  updatedAt:  Date           // Auto-managed
}
```

**Key features:**
- `userId` field enables per-user data isolation
- All CRUD queries include `{ userId: req.user._id }` filter
- Indexed for efficient querying

### Data Isolation

Every database query in the Contact controller is scoped to the authenticated user's ID:

```typescript
// Example: GET all contacts
const filter = { userId: req.user._id };
const contacts = await Contact.find(filter).sort({ createdAt: -1 });
```

This ensures **User A can never see User B's contacts**, even if they guess the contact's `_id`.

---

## 7. Authentication System

### JWT Token Flow

```
Registration/Login:
  Request → Validate → Hash/Compare → Generate JWT → Return { token, user }

Protected Endpoints:
  Request → Extract Bearer token → Verify JWT signature → Decode userId →
  Fetch user from DB → Attach to req.user → Continue to controller
```

**Token Configuration:**
- Algorithm: HS256 (HMAC-SHA256)
- Expiry: 7 days (configurable via `JWT_EXPIRE`)
- Payload: `{ userId, email, role }`
- Storage: Client `localStorage`
- Transmission: `Authorization: Bearer <token>` header

### Google OAuth Flow

```
1. Client navigates to /api/auth/google
2. Server redirects to Google consent screen
3. User approves → Google sends authorization code to callback URL
4. Server exchanges code for user profile (email, name, photo)
5. Server finds or creates user in MongoDB (by googleId or email)
6. Server generates JWT token
7. Redirects to client: /auth-callback?token=<jwt>
8. Client extracts token, stores in localStorage, redirects to /dashboard
```

### Middleware Pipeline

```
authenticate()      → Extracts JWT, verifies, attaches user to request
optionalAuth()      → Same as authenticate but doesn't fail if no token (for contact submission)
authorize(roles)    → Checks if user role is in the allowed roles array
```

---

## 8. Real-Time Communication

### Socket.IO Architecture

```
Server Side:
  - Initializes Socket.IO with CORS matching Express CORS config
  - On connection: client joins "dashboard" room and "user:<userId>" room
  - emitToUser(userId, event, data) — sends to a specific user's room
  - emitToDashboard(event, data) — broadcasts to all connected dashboards

Client Side:
  - useSocket() hook manages connection lifecycle
  - Joins user-specific room on authentication
  - Listens for contact:created, contact:updated, contact:deleted events
  - Triggers data refresh on receipt

Fallback:
  - useContacts() hook starts 15-second HTTP polling when socket is disconnected
  - Polling stops when socket reconnects
```

### Why User-Specific Rooms?

Without rooms, all users would receive all contact events. By having each user join `user:<theirId>`, the server only emits events for contacts belonging to that user. This maintains data isolation in real-time, not just in REST API queries.

---

## 9. Security Implementation

### Middleware Stack (applied in order)

| # | Middleware              | Purpose                                                        |
|---|--------------------------|----------------------------------------------------------------|
| 1 | **Helmet**              | Sets security HTTP headers (X-Frame-Options, X-Content-Type, etc.) |
| 2 | **CORS**                | Restricts origins to configured CLIENT_URL (supports comma-separated) |
| 3 | **Rate Limiter**        | General: 100 req/15min per IP                                  |
| 4 | **Auth Rate Limiter**   | Login/Register: 20 req/15min per IP                            |
| 5 | **Contact Rate Limiter**| Contact form: 5 submissions/15min per IP                       |
| 6 | **express-mongo-sanitize** | Prevents NoSQL injection by stripping `$` and `.` from inputs |
| 7 | **HPP**                 | Prevents HTTP Parameter Pollution attacks                      |
| 8 | **XSS-clean**           | Sanitizes user input to prevent Cross-Site Scripting           |
| 9 | **compression**         | Gzip compression for response bodies                           |

### Password Security

- Hashing: bcryptjs with 12 salt rounds
- Passwords stored as irreversible hashes
- Password field excluded from all queries by default (`select: false`)
- Comparison done via `user.comparePassword()` which uses bcrypt.compare

### Input Validation

- Server-side: Joi schemas validate all incoming request bodies, query parameters, and URL parameters
- Client-side: Zod schemas provide real-time form validation with React Hook Form
- Both layers ensure defense-in-depth against malformed input

---

## 10. API Documentation

### Base URL

- Local: `http://localhost:5000/api`
- Production: `https://techflow-server-internship.onrender.com/api`

### Endpoints

#### Health Check
```
GET /api/health
Response: { success, message, timestamp, environment, uptime, version, database: { status, responseTime } }
```

#### Authentication
```
POST /api/auth/register
Body: { name, email, password }
Response: { success, token, data: user, message }

POST /api/auth/login
Body: { email, password }
Response: { success, token, data: user, message }

GET /api/auth/google
→ Redirects to Google consent screen

GET /api/auth/google/callback
→ Redirects to client with JWT token

GET /api/auth/me  [JWT Required]
Response: { success, data: user }

POST /api/auth/logout
Response: { success, message }
```

#### Contacts
```
POST /api/contact  [Optional Auth]
Body: { name, email, subject, message }
Response: { success, data: contact, message }

GET /api/contact  [JWT Required]
Query: ?page=1&limit=10&status=new&search=keyword
Response: { success, data: [contacts], pagination: { page, limit, total, pages, hasNext, hasPrev } }

GET /api/contact/stats  [JWT Required]
Response: { success, data: { total, new, read, replied, archived } }

GET /api/contact/export  [JWT Required]
Response: CSV file download

GET /api/contact/:id  [JWT Required]
Response: { success, data: contact }

PATCH /api/contact/:id/status  [JWT Required]
Body: { status: "new" | "read" | "replied" | "archived" }
Response: { success, data: contact, message }

DELETE /api/contact/:id  [JWT Required]
Response: { success, message }
```

### Error Response Format

All errors follow a consistent format:
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error description",
    "code": "MACHINE_READABLE_CODE"
  }
}
```

---

## 11. Frontend Implementation

### Component Architecture

```
App.tsx
├── Navbar (hidden on auth pages)
├── Routes
│   ├── "/" → Home
│   │   ├── Hero Section
│   │   ├── Features Section
│   │   └── Contact Section
│   ├── "/login" → Login Page
│   ├── "/register" → Register Page
│   ├── "/dashboard" → ProtectedRoute → Dashboard Page
│   └── "/auth-callback" → AuthCallback (handles Google OAuth redirect)
└── Footer (hidden on auth pages)
```

### State Management

- **AuthContext** — Manages user authentication state, JWT token, login/logout/register functions. Persists token in `localStorage` and auto-fetches user profile on app load.
- **useContacts Hook** — Manages contact data fetching, real-time updates, status changes, and CSV export. Provides `contacts`, `stats`, `loading`, `isConnected` state.
- **useSocket Hook** — Manages Socket.IO connection lifecycle, room joining, and event listening.

### UI Design

The application uses a **Google-inspired design system** with:
- Primary blue (#1a73e8) for CTAs and links
- Green (#34a853) for success states
- Yellow/amber (#f59e0b) for warnings
- Red (#ea4335) for errors and destructive actions
- Clean white backgrounds with subtle shadows
- Rounded corners and smooth transitions

---

## 12. Deployment Strategy

### Architecture

```
GitHub Repository
    │
    ├── Push to main branch
    │
    ├──→ Vercel (auto-deploy)
    │    └── Builds client/ with Vite
    │    └── Serves as static SPA with CDN
    │
    └──→ Render (auto-deploy)
         └── Builds server/ with TypeScript compiler
         └── Runs as persistent Node.js process
         └── Socket.IO works (long-lived server)
```

### Why Render (Not Vercel) for the Server?

Vercel uses **serverless functions** — each request spins up a fresh function instance. This breaks Socket.IO because WebSockets require a persistent, long-lived server process. Render provides a traditional Node.js hosting environment where the server stays running, enabling real-time WebSocket connections.

### Production Build Process

**Server:**
```bash
npm install --include=dev    # Install all deps (incl. TypeScript for compilation)
npm run build                # tsc → compiles TypeScript to dist/
npm start                    # node -r module-alias/register dist/server.js
```

**Client:**
```bash
npm install
npm run build                # tsc type-check + vite build → static assets
```

### Environment Variables

Both Vercel and Render have environment variable dashboards. Key production variables:
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET`, `SESSION_SECRET` — Secure random strings
- `CLIENT_URL` / `CORS_ORIGIN` — Vercel client URL
- `VITE_API_URL` — Render server URL + `/api`
- `GOOGLE_CALLBACK_URL` — Points to Render server callback

---

## 13. How to Use the Application

### For End Users

1. **Visit the website** at https://techflow367.vercel.app
2. **Browse the landing page** — explore the Hero, Features, and Contact sections
3. **Submit a contact inquiry** — fill out the form at the bottom of the page (works without an account)
4. **Create an account** — click "Get Started" or "Sign Up" to register with email/password or Google
5. **Access the Dashboard** — after login, you're redirected to your personal dashboard
6. **View contacts** — all your submitted contacts appear in a table with status badges
7. **Search & filter** — use the search bar and status dropdown to find specific contacts
8. **Update status** — click the status badge to change a contact's state (New → Read → Replied → Archived)
9. **Export to CSV** — click the export button to download all contacts as a spreadsheet
10. **Logout** — click the user avatar or logout button in the navbar

### For Developers

1. **Clone the repo**: `git clone https://github.com/AkshayRaj367/Intership-project.git`
2. **Run setup**: `node setup.js` (interactive wizard handles everything)
3. **Or manual setup**: See README.md for step-by-step instructions
4. **API testing**: Use Postman or curl against `http://localhost:5000/api`
5. **Health check**: `GET http://localhost:5000/api/health` to verify server + database status

---

## 14. Project Structure

```
techflow/
├── setup.js                         # Automated setup wizard
├── README.md                        # Project documentation
├── .gitignore                       # Git ignore rules
├── docs/
│   ├── ARCHITECTURE_DIAGRAM.md      # Mermaid diagrams + AI prompts
│   └── PROJECT_REPORT.md            # This report
│
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.tsx                  # Root component + routing
│   │   ├── main.tsx                 # React entry point
│   │   ├── components/              # Reusable UI components
│   │   │   ├── auth/                # AuthCallback, ProtectedRoute
│   │   │   ├── layout/              # Navbar, Footer
│   │   │   ├── sections/            # Hero, Features, Contact
│   │   │   └── ui/                  # Button, Card, Input, Spinner
│   │   ├── contexts/AuthContext.tsx  # Auth state management
│   │   ├── hooks/                   # useContacts, useSocket
│   │   ├── lib/                     # Axios config, utilities
│   │   ├── pages/                   # Home, Dashboard, Login, Register
│   │   ├── schemas/                 # Zod validation schemas
│   │   ├── styles/                  # Animation + theme config
│   │   └── types/index.ts           # TypeScript type definitions
│   └── package.json
│
└── server/                          # Backend (Express + TypeScript)
    ├── src/
    │   ├── server.ts                # HTTP server + Socket.IO bootstrap
    │   ├── app.ts                   # Express app class
    │   ├── config/                  # Database, Email, Passport, Socket
    │   ├── controllers/             # Contact controller (CRUD)
    │   ├── middlewares/             # Auth, Security, Validation
    │   ├── models/                  # User, Contact Mongoose models
    │   ├── routes/                  # Auth + Contact route definitions
    │   ├── services/                # Change stream service
    │   ├── types/                   # TypeScript definitions
    │   └── utils/logger.ts          # Winston logger
    └── package.json
```

**Total source files**: ~40 TypeScript/TSX files
**Client bundle size**: ~580 KB (gzipped)
**Server dependencies**: 25 production + 15 dev

---

## 15. Challenges & Solutions

### Challenge 1: Workspace Path with Apostrophe

**Problem:** The project directory contained an apostrophe (`Akshay's Stuff`), causing `ts-node-dev` to crash on Windows.

**Solution:** Switched from `ts-node-dev` to `nodemon` with `ts-node` for the development server, which handles special characters in paths correctly.

### Challenge 2: MongoDB Stale Indexes

**Problem:** An old `username_1` unique index on the users collection caused duplicate key errors during Google OAuth sign-ups, even though the `username` field was removed from the schema.

**Solution:** Added automatic stale index detection and cleanup in `database.ts` — on connection, it scans for indexes referencing non-existent fields and drops them.

### Challenge 3: Module Path Aliases in Production

**Problem:** TypeScript `@/*` path aliases compiled to `require("@/config/database")` in the JavaScript output, which Node.js cannot resolve.

**Solution:** Evaluated `tsc-alias` (didn't work consistently) and settled on `module-alias` for runtime path resolution. Added `_moduleAliases` config to `package.json` mapping `@` to `dist/`.

### Challenge 4: Serverless WebSocket Limitation

**Problem:** Vercel's serverless functions cannot maintain persistent WebSocket connections, breaking Socket.IO.

**Solution:** Deployed the server on Render (persistent Node.js) and added a 15-second HTTP polling fallback in `useContacts.ts` for when Socket.IO is unavailable.

### Challenge 5: Build Dependencies on Render

**Problem:** Render's production `npm install` skips `devDependencies`, but TypeScript and type definitions are needed for the build step.

**Solution:** Changed Render's build command to `npm install --include=dev && npm run build` to ensure all compilation tools are available.

---

## 16. Future Enhancements

| Enhancement             | Description                                                     |
| ----------------------- | --------------------------------------------------------------- |
| Dark Mode               | Toggle between light/dark themes (flags already in .env)        |
| Admin Panel             | Separate admin view to see all users' contacts                  |
| Email Templates         | Rich HTML email templates for notifications                     |
| Contact Replies         | Reply directly to contacts from the dashboard                   |
| File Attachments        | Allow file uploads with contact submissions                     |
| Analytics Dashboard     | Charts and graphs for contact trends over time                  |
| Two-Factor Auth         | TOTP-based 2FA for additional security                          |
| Audit Logging           | Detailed logs of all user actions for compliance                |
| Webhook Integrations    | Notify external services (Slack, Discord) on new contacts       |
| Mobile App              | React Native companion app                                      |

---

## 17. Conclusion

TechFlow successfully demonstrates the ability to design, build, and deploy a production-grade full-stack web application. The project covers all critical aspects of modern web development:

- **Frontend excellence** — A responsive, animated React SPA with TypeScript safety and clean component architecture
- **Backend robustness** — A secure Express API with layered middleware, dual authentication, and real-time capabilities
- **Database design** — Proper data modeling with per-user isolation and efficient querying
- **Security** — Defense-in-depth with rate limiting, input sanitization, CORS, and encrypted credentials
- **DevOps** — Cloud deployment across Vercel and Render with automated CI/CD from GitHub
- **Developer Experience** — Interactive setup wizard, comprehensive documentation, and clean project structure

The application is fully functional in production and ready for further iteration and enhancement.

---

*Report generated for Web Development Internship Assignment by Akshay Raj.*
