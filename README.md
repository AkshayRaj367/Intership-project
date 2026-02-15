# TechFlow — Contact Management Platform

<div align="center">

![TechFlow](https://img.shields.io/badge/TechFlow-v1.0.0-1a73e8?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=for-the-badge&logo=typescript)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=for-the-badge&logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socket.io)

**A full-stack, enterprise-grade contact management platform with real-time updates, multi-auth support, and per-user data isolation.**

[Live Demo (Client)](https://techflow367.vercel.app) · [Live API](https://techflow-server-internship.onrender.com/api) · [Report a Bug](https://github.com/AkshayRaj367/Intership-project/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Setup (Automated)](#quick-setup-automated)
  - [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Real-Time Updates](#real-time-updates)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Security](#security)
- [Screenshots](#screenshots)
- [License](#license)

---

## Overview

TechFlow is a **full-stack contact management platform** built as a web development internship assignment. It allows users to submit contact inquiries through a public form and manage them in a private dashboard. Each user sees **only their own contacts**, with real-time updates via Socket.IO and a polished Google-themed UI.

The project demonstrates modern full-stack engineering practices including:
- Clean architecture with TypeScript on both client and server
- Dual authentication (email/password + Google OAuth 2.0)
- Real-time communication via WebSockets with polling fallback
- Per-user data isolation at the database query level
- Production deployment across multiple cloud platforms

---

## Features

### Public-Facing
- **Landing Page** — Hero, Features, and Contact sections with smooth Framer Motion animations
- **Contact Form** — Submit inquiries (general, demo, support, partnership) with Zod validation
- **Responsive Design** — Fully mobile-responsive using Tailwind CSS

### Authenticated Dashboard
- **Contact Management** — View, search, filter, and manage all your submitted contacts
- **Real-Time Updates** — Contacts appear instantly via Socket.IO (15s polling fallback)
- **Status Tracking** — Mark contacts as New → Read → Replied → Archived
- **CSV Export** — Download all contacts as a CSV file
- **Statistics** — Overview cards showing total, new, read, and replied counts
- **Connection Indicator** — Live/offline WebSocket status shown in the dashboard

### Authentication & Security
- **Email/Password Registration** — bcrypt-hashed passwords, JWT tokens
- **Google OAuth 2.0** — One-click sign-in via Passport.js
- **Per-User Data Isolation** — Each user sees only contacts they submitted
- **Rate Limiting** — Separate limits for general API (100/15min), auth (20/15min), and contact form (5/15min)
- **Security Middleware** — Helmet, HPP, mongo-sanitize, XSS protection, CORS

---

## Tech Stack

| Layer      | Technology                                                   |
| ---------- | ------------------------------------------------------------ |
| **Frontend** | React 18, TypeScript, Vite 4.5, Tailwind CSS 3.3, Framer Motion |
| **State**    | Zustand-style context (AuthContext), React hooks              |
| **Forms**    | React Hook Form + Zod schema validation                      |
| **Routing**  | React Router DOM 6.20                                        |
| **Backend**  | Node.js, Express 4.18, TypeScript 5.3                        |
| **Database** | MongoDB Atlas (Mongoose 8 ODM)                               |
| **Auth**     | Passport.js (Google OAuth 2.0 + JWT strategy), bcryptjs      |
| **Realtime** | Socket.IO 4.8 (server) + socket.io-client (client)           |
| **Email**    | Nodemailer (Gmail SMTP) — optional                           |
| **Logging**  | Winston (console + file transports)                          |
| **Hosting**  | Vercel (client) + Render (server)                            |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                       CLIENT (Vercel)                        │
│  React 18 + Vite + TypeScript + Tailwind CSS                 │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Home    │  │  Login /  │  │Dashboard │  │Auth      │   │
│  │  Page    │  │  Register │  │  Page    │  │Callback  │   │
│  └────┬─────┘  └─────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │              │              │              │          │
│  ┌────▼──────────────▼──────────────▼──────────────▼─────┐   │
│  │           Axios HTTP Client + Socket.IO Client        │   │
│  └───────────────────────┬───────────────────────────────┘   │
└──────────────────────────┼───────────────────────────────────┘
                           │  REST API + WebSocket
┌──────────────────────────▼───────────────────────────────────┐
│                      SERVER (Render)                          │
│  Express 4.18 + TypeScript + Socket.IO                       │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                  Security Layer                       │    │
│  │  Helmet · CORS · Rate Limit · Mongo Sanitize · HPP   │    │
│  └──────────────────────┬───────────────────────────────┘    │
│  ┌──────────────────────▼───────────────────────────────┐    │
│  │                  Routes & Controllers                 │    │
│  │  /api/auth/*  ─── Auth Controller (JWT + Google)      │    │
│  │  /api/contact/* ── Contact Controller (CRUD + export) │    │
│  │  /api/health  ─── Health Check                        │    │
│  └──────────────────────┬───────────────────────────────┘    │
│  ┌──────────────────────▼───────────────────────────────┐    │
│  │              Middleware Pipeline                       │    │
│  │  Auth (JWT verify) · Validation (Joi) · Rate Limit    │    │
│  └──────────────────────┬───────────────────────────────┘    │
│  ┌──────────────────────▼───────────────────────────────┐    │
│  │              Services & Models                        │    │
│  │  User Model (bcrypt) · Contact Model · Email Service  │    │
│  │  Change Streams · Socket.IO Emitters                  │    │
│  └──────────────────────┬───────────────────────────────┘    │
└──────────────────────────┼───────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                    MongoDB Atlas (Cloud)                      │
│  ┌────────────────┐   ┌──────────────────┐                   │
│  │  users          │   │  contacts         │                   │
│  │  - email        │   │  - name           │                   │
│  │  - password     │   │  - email          │                   │
│  │  - googleId     │   │  - subject        │                   │
│  │  - name         │   │  - message        │                   │
│  │  - avatar       │   │  - userId (ref)   │                   │
│  │  - role         │   │  - status         │                   │
│  └────────────────┘   └──────────────────┘                   │
└──────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
Email/Password:
  Client → POST /api/auth/register or /login → Server validates → JWT returned → stored in localStorage

Google OAuth:
  Client → GET /api/auth/google → Google consent screen → Callback → Server issues JWT → redirect with token
```

### Real-Time Flow

```
Contact submitted → Server saves to MongoDB → Socket.IO emits to user room → Dashboard updates instantly
                                              (fallback: 15s polling via HTTP GET /api/contact)
```

---

## Project Structure

```
techflow/
├── setup.js                    # Interactive setup wizard
├── .gitignore                  # Git ignore rules
├── .env.example                # Root env template
│
├── client/                     # React Frontend (Vite)
│   ├── index.html              # HTML entry point
│   ├── package.json            # Client dependencies & scripts
│   ├── vite.config.ts          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── tsconfig.json           # TypeScript configuration
│   ├── vercel.json             # Vercel SPA routing config
│   └── src/
│       ├── main.tsx            # React entry point
│       ├── App.tsx             # Root component with routing
│       ├── index.css           # Global styles + Tailwind
│       ├── components/
│       │   ├── auth/
│       │   │   ├── AuthCallback.tsx   # Google OAuth token handler
│       │   │   └── ProtectedRoute.tsx # Route guard component
│       │   ├── layout/
│       │   │   ├── Navbar.tsx         # Navigation bar
│       │   │   └── Footer.tsx         # Footer component
│       │   ├── sections/
│       │   │   ├── Hero.tsx           # Landing hero section
│       │   │   ├── Features.tsx       # Features showcase
│       │   │   └── Contact.tsx        # Contact form section
│       │   └── ui/
│       │       ├── Button.tsx         # Reusable button component
│       │       ├── Card.tsx           # Card component
│       │       ├── Input.tsx          # Form input component
│       │       └── LoadingSpinner.tsx # Loading indicator
│       ├── contexts/
│       │   └── AuthContext.tsx        # Auth state management
│       ├── hooks/
│       │   ├── useContacts.ts         # Contact data + real-time hook
│       │   └── useSocket.ts           # Socket.IO connection hook
│       ├── lib/
│       │   ├── api.ts                 # Axios instance & interceptors
│       │   └── utils.ts              # Utility functions (cn, etc.)
│       ├── pages/
│       │   ├── Home.tsx               # Landing page
│       │   ├── Dashboard.tsx          # Contact management dashboard
│       │   ├── Login.tsx              # Login page
│       │   └── Register.tsx           # Registration page
│       ├── schemas/                   # Zod validation schemas
│       ├── styles/
│       │   ├── animations.ts         # Framer Motion variants
│       │   └── google-theme.ts       # Google-inspired color tokens
│       └── types/
│           └── index.ts              # TypeScript type definitions
│
├── server/                     # Express Backend
│   ├── package.json            # Server dependencies & scripts
│   ├── tsconfig.json           # TypeScript configuration
│   ├── vercel.json             # Vercel serverless config
│   ├── api/
│   │   └── index.ts            # Vercel serverless entry point
│   └── src/
│       ├── server.ts           # HTTP server bootstrap
│       ├── app.ts              # Express app class (middleware, routes)
│       ├── config/
│       │   ├── database.ts     # MongoDB connection & lifecycle
│       │   ├── email.ts        # Nodemailer email service
│       │   ├── passport.ts     # Passport strategies (Google + JWT)
│       │   └── socket.ts       # Socket.IO initialization
│       ├── controllers/
│       │   └── contact.controller.ts  # Contact CRUD operations
│       ├── middlewares/
│       │   ├── auth.middleware.ts      # JWT authentication & authorization
│       │   ├── security.middleware.ts  # Helmet, CORS, rate limiting
│       │   └── validation.middleware.ts# Request validation (Joi)
│       ├── models/
│       │   ├── User.model.ts          # User schema (bcrypt, toSafeObject)
│       │   └── Contact.model.ts       # Contact schema
│       ├── routes/
│       │   ├── auth.routes.ts         # Auth endpoints (register/login/google)
│       │   └── contact.routes.ts      # Contact CRUD routes
│       ├── services/
│       │   └── changeStream.service.ts# MongoDB change stream listener
│       ├── types/
│       │   ├── index.ts               # Server type definitions
│       │   └── global.d.ts            # Global type augmentations
│       └── utils/
│           └── logger.ts              # Winston logger configuration
│
└── docs/                       # Documentation
    ├── ARCHITECTURE_DIAGRAM.md # Diagram prompts for AI tools
    └── PROJECT_REPORT.md       # Full project report
```

---

## Getting Started

### Prerequisites

| Requirement  | Version  | Purpose                     |
| ------------ | -------- | --------------------------- |
| Node.js      | ≥ 16.x   | JavaScript runtime          |
| npm          | ≥ 8.x    | Package management          |
| MongoDB      | Atlas or local | Database                |
| Git          | Any      | Version control             |

### Quick Setup (Automated)

The fastest way to get started. Clone the repo and run the setup wizard:

```bash
# 1. Clone the repository
git clone https://github.com/AkshayRaj367/Intership-project.git
cd Intership-project

# 2. Run the interactive setup wizard
node setup.js
```

The wizard will:
- Verify Node.js and npm versions
- Create `.env` files with your configuration
- Auto-generate secure JWT and session secrets
- Install all dependencies for client and server
- Optionally start both development servers

### Manual Setup

If you prefer manual configuration:

```bash
# 1. Clone the repository
git clone https://github.com/AkshayRaj367/Intership-project.git
cd Intership-project

# 2. Install server dependencies
cd server
npm install

# 3. Create server .env file
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secrets, etc.

# 4. Install client dependencies
cd ../client
npm install

# 5. Create client .env file
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:5000/api

# 6. Start development servers (in separate terminals)

# Terminal 1 — Server
cd server
npm run dev        # Starts on http://localhost:5000

# Terminal 2 — Client
cd client
npm run dev        # Starts on http://localhost:3000
```

---

## Environment Variables

### Server (`server/.env`)

| Variable              | Required | Default                   | Description                          |
| --------------------- | -------- | ------------------------- | ------------------------------------ |
| `NODE_ENV`            | No       | `development`             | Environment mode                     |
| `PORT`                | No       | `5000`                    | Server port                          |
| `MONGODB_URI`         | **Yes**  | —                         | MongoDB connection string            |
| `JWT_SECRET`          | **Yes**  | —                         | JWT signing secret (32+ chars)       |
| `JWT_EXPIRE`          | No       | `7d`                      | JWT token expiry                     |
| `JWT_REFRESH_SECRET`  | **Yes**  | —                         | Refresh token secret (32+ chars)     |
| `JWT_REFRESH_EXPIRE`  | No       | `30d`                     | Refresh token expiry                 |
| `GOOGLE_CLIENT_ID`    | No       | —                         | Google OAuth client ID               |
| `GOOGLE_CLIENT_SECRET`| No       | —                         | Google OAuth client secret           |
| `GOOGLE_CALLBACK_URL` | No       | —                         | Google OAuth callback URL            |
| `EMAIL_USER`          | No       | —                         | Gmail address for notifications      |
| `EMAIL_APP_PASS`      | No       | —                         | Gmail App Password                   |
| `CLIENT_URL`          | **Yes**  | `http://localhost:3000`   | Frontend URL (for redirects)         |
| `CORS_ORIGIN`         | **Yes**  | `http://localhost:3000`   | Allowed CORS origins (comma-separated)|
| `SESSION_SECRET`      | **Yes**  | —                         | Express session secret (32+ chars)   |
| `BCRYPT_SALT_ROUNDS`  | No       | `12`                      | Password hashing rounds              |

### Client (`client/.env`)

| Variable          | Required | Default                       | Description              |
| ----------------- | -------- | ----------------------------- | ------------------------ |
| `VITE_API_URL`    | **Yes**  | `http://localhost:5000/api`   | Backend API base URL     |
| `VITE_SOCKET_URL` | No       | Same as API URL origin        | Socket.IO server URL     |
| `VITE_APP_NAME`   | No       | `TechFlow`                    | Application display name |

---

## API Reference

Base URL: `http://localhost:5000/api`

### Health Check

| Method | Endpoint       | Auth | Description              |
| ------ | -------------- | ---- | ------------------------ |
| GET    | `/api/health`  | No   | Server & DB health check |

### Authentication

| Method | Endpoint                    | Auth | Description              |
| ------ | --------------------------- | ---- | ------------------------ |
| POST   | `/api/auth/register`        | No   | Register with email/password |
| POST   | `/api/auth/login`           | No   | Login with email/password    |
| GET    | `/api/auth/google`          | No   | Initiate Google OAuth        |
| GET    | `/api/auth/google/callback` | No   | Google OAuth callback        |
| GET    | `/api/auth/me`              | JWT  | Get current user profile     |
| POST   | `/api/auth/logout`          | No   | Logout and clear cookies     |

### Contacts

| Method | Endpoint                     | Auth | Description                |
| ------ | ---------------------------- | ---- | -------------------------- |
| POST   | `/api/contact`               | Optional | Submit a contact form  |
| GET    | `/api/contact`               | JWT  | List contacts (paginated)  |
| GET    | `/api/contact/stats`         | JWT  | Get contact statistics     |
| GET    | `/api/contact/export`        | JWT  | Export contacts as CSV     |
| GET    | `/api/contact/:id`           | JWT  | Get single contact         |
| PATCH  | `/api/contact/:id/status`    | JWT  | Update contact status      |
| DELETE | `/api/contact/:id`           | JWT  | Delete a contact           |

#### Query Parameters for `GET /api/contact`

| Parameter | Type   | Default | Description            |
| --------- | ------ | ------- | ---------------------- |
| `page`    | number | 1       | Page number            |
| `limit`   | number | 10      | Items per page         |
| `status`  | string | —       | Filter by status       |
| `search`  | string | —       | Search name/email/body |

---

## Real-Time Updates

TechFlow uses **Socket.IO** for real-time contact updates:

1. On login, the client joins a user-specific room: `user:<userId>`
2. When a contact is submitted, the server emits to that room
3. Dashboard re-fetches and updates instantly
4. If WebSocket is unavailable (e.g., serverless), a **15-second polling fallback** kicks in

### Socket Events

| Event             | Direction       | Payload                       |
| ----------------- | --------------- | ----------------------------- |
| `contact:created` | Server → Client | `{ type, contact, timestamp }` |
| `contact:updated` | Server → Client | `{ type, contact, timestamp }` |
| `contact:deleted` | Server → Client | `{ type, contactId, timestamp }`|

---

## Authentication

### Email/Password Flow

1. User registers at `/register` with name, email, password
2. Password is hashed with bcryptjs (12 salt rounds)
3. JWT token is returned and stored in `localStorage`
4. Subsequent requests include `Authorization: Bearer <token>` header

### Google OAuth Flow

1. User clicks "Sign in with Google" → redirected to Google consent
2. Google calls back to `/api/auth/google/callback`
3. Server creates/finds user, generates JWT
4. Redirects to `/auth-callback?token=<jwt>` on the client
5. Client stores token and redirects to dashboard

---

## Deployment

### Recommended: Render (Server) + Vercel (Client)

This is the recommended free-tier deployment strategy:

#### Server on Render

1. Create a **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install --include=dev && npm run build`
   - **Start Command**: `npm start`
4. Add environment variables (see [Environment Variables](#environment-variables))
5. Set `CLIENT_URL` and `CORS_ORIGIN` to your Vercel URL

#### Client on Vercel

1. Import project on [Vercel](https://vercel.com)
2. Settings:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
3. Add `VITE_API_URL` = `https://your-server.onrender.com/api`
4. Add `VITE_SOCKET_URL` = `https://your-server.onrender.com`

---

## Security

TechFlow implements multiple security layers:

| Feature             | Implementation                     |
| ------------------- | ---------------------------------- |
| CORS                | Configurable allowed origins       |
| Helmet              | HTTP security headers              |
| Rate Limiting       | express-rate-limit (tiered)        |
| Input Sanitization  | express-mongo-sanitize + XSS clean |
| Parameter Pollution | HPP middleware                     |
| Password Hashing    | bcryptjs with 12 rounds            |
| JWT Authentication  | Signed tokens with configurable expiry |
| Data Isolation      | Per-user query scoping on all CRUD |

---

## Screenshots

> Add screenshots to a `screenshots/` folder and update the paths below.

| Page        | Description                    |
| ----------- | ------------------------------ |
| Home        | Landing page with hero section |
| Login       | Email/password + Google OAuth  |
| Register    | New account registration       |
| Dashboard   | Contact management interface   |

---

## Scripts Reference

### Server

| Script            | Command                | Description                   |
| ----------------- | ---------------------- | ----------------------------- |
| `npm run dev`     | `nodemon ... ts-node`  | Start dev server with hot reload |
| `npm run build`   | `tsc`                  | Compile TypeScript to `dist/` |
| `npm start`       | `node -r module-alias/register dist/server.js` | Start production server |
| `npm run lint`    | `eslint`               | Lint source files             |
| `npm run format`  | `prettier`             | Format source files           |

### Client

| Script            | Command          | Description                    |
| ----------------- | ---------------- | ------------------------------ |
| `npm run dev`     | `vite`           | Start Vite dev server (HMR)   |
| `npm run build`   | `tsc && vite build` | Type-check and build for prod |
| `npm run preview` | `vite preview`   | Preview production build       |
| `npm run lint`    | `eslint`         | Lint source files              |

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/AkshayRaj367">Akshay Raj</a></p>
  <p>Web Development Internship Assignment</p>
</div>
