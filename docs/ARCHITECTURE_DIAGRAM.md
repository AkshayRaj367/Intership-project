# TechFlow — Architecture Diagram Prompts

Use the prompts below to generate visual architecture diagrams with AI tools (ChatGPT, Claude, Gemini) or paste the Mermaid code into [mermaid.live](https://mermaid.live).

---

## 1. System Architecture — Mermaid Diagram

Copy this Mermaid code directly into any Mermaid renderer:

```mermaid
graph TB
    subgraph Client["CLIENT — Vercel"]
        direction TB
        Browser["Browser"]
        subgraph ReactApp["React 18 + Vite + TypeScript"]
            Pages["Pages<br/>Home · Login · Register · Dashboard"]
            Components["Components<br/>Navbar · Footer · Hero · Features · Contact Form"]
            Hooks["Hooks<br/>useContacts · useSocket"]
            Context["AuthContext<br/>JWT token · User state"]
            Axios["Axios HTTP Client"]
            SocketClient["Socket.IO Client"]
        end
        Browser --> ReactApp
        Pages --> Hooks
        Pages --> Context
        Hooks --> Axios
        Hooks --> SocketClient
    end

    subgraph Server["SERVER — Render"]
        direction TB
        subgraph Express["Express 4.18 + TypeScript"]
            Security["Security Layer<br/>Helmet · CORS · Rate Limit<br/>Mongo Sanitize · HPP · XSS"]
            Routes["Routes<br/>/api/auth/* · /api/contact/* · /api/health"]
            Middleware["Middleware<br/>JWT Auth · Validation · Rate Limit"]
            Controllers["Controllers<br/>Contact CRUD · Stats · Export CSV"]
            Models["Mongoose Models<br/>User · Contact"]
            Services["Services<br/>Email · Change Streams"]
            Passport["Passport.js<br/>Google OAuth · JWT Strategy"]
        end
        SocketServer["Socket.IO Server"]
        Logger["Winston Logger"]
    end

    subgraph Database["MongoDB Atlas"]
        Users[(users collection)]
        Contacts[(contacts collection)]
    end

    subgraph External["External Services"]
        Google["Google OAuth 2.0"]
        Gmail["Gmail SMTP"]
    end

    Axios -->|"REST API (HTTPS)"| Security
    SocketClient <-->|"WebSocket"| SocketServer
    Security --> Routes
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> Models
    Models --> Database
    Controllers --> Services
    Controllers --> SocketServer
    Passport <-->|"OAuth 2.0"| Google
    Services -->|"SMTP"| Gmail

    style Client fill:#e8f0fe,stroke:#1a73e8,stroke-width:2px
    style Server fill:#e6f4ea,stroke:#34a853,stroke-width:2px
    style Database fill:#fef7e0,stroke:#f59e0b,stroke-width:2px
    style External fill:#fce8e6,stroke:#ea4335,stroke-width:2px
```

---

## 2. Authentication Flow — Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    participant U as User/Browser
    participant C as React Client
    participant S as Express Server
    participant DB as MongoDB
    participant G as Google OAuth

    Note over U,G: Email/Password Registration
    U->>C: Fill registration form
    C->>C: Zod validation
    C->>S: POST /api/auth/register
    S->>S: Validate input (Joi)
    S->>S: Hash password (bcrypt 12 rounds)
    S->>DB: Create user document
    DB-->>S: User saved
    S->>S: Generate JWT (7d expiry)
    S-->>C: { token, user }
    C->>C: Store token in localStorage
    C-->>U: Redirect to /dashboard

    Note over U,G: Email/Password Login
    U->>C: Enter email & password
    C->>S: POST /api/auth/login
    S->>DB: Find user by email
    DB-->>S: User document (with hashed password)
    S->>S: Compare passwords (bcrypt)
    S->>S: Generate JWT
    S-->>C: { token, user }
    C->>C: Store token in localStorage
    C-->>U: Redirect to /dashboard

    Note over U,G: Google OAuth Flow
    U->>C: Click "Sign in with Google"
    C->>S: GET /api/auth/google
    S->>G: Redirect to Google consent
    G-->>U: Show consent screen
    U->>G: Approve
    G->>S: GET /api/auth/google/callback?code=xxx
    S->>G: Exchange code for profile
    G-->>S: User profile + email
    S->>DB: Find or create user
    DB-->>S: User document
    S->>S: Generate JWT
    S-->>C: Redirect to /auth-callback?token=xxx
    C->>C: Extract token, store in localStorage
    C-->>U: Redirect to /dashboard
```

---

## 3. Contact Lifecycle — Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant C as React Client
    participant S as Express Server
    participant DB as MongoDB
    participant WS as Socket.IO
    participant E as Email Service

    Note over U,E: Contact Submission
    U->>C: Fill contact form
    C->>C: Zod validation
    C->>S: POST /api/contact (with JWT if logged in)
    S->>S: Rate limit check (5/15min)
    S->>S: Input validation (Joi)
    S->>S: Extract userId from JWT (if present)
    S->>DB: Create contact { ...data, userId }
    DB-->>S: Contact saved
    S->>WS: Emit 'contact:created' to user room
    S--)E: Send confirmation email (async)
    S--)E: Send admin notification (async)
    S-->>C: 201 { success, contact }
    C-->>U: Success toast

    Note over U,E: Real-time Dashboard Update
    WS-->>C: 'contact:created' event
    C->>S: GET /api/contact?userId (refresh)
    S->>DB: Find contacts WHERE userId = currentUser
    DB-->>S: User's contacts
    S-->>C: Paginated contacts
    C-->>U: Dashboard updates instantly

    Note over U,E: Status Update
    U->>C: Click status button (New → Read)
    C->>S: PATCH /api/contact/:id/status
    S->>DB: Update contact status WHERE userId + _id
    DB-->>S: Updated
    S->>WS: Emit 'contact:updated'
    S-->>C: { success, contact }
```

---

## 4. Data Model — Mermaid ER Diagram

```mermaid
erDiagram
    USERS {
        ObjectId _id PK
        string email UK
        string password "hashed, optional"
        string googleId "optional"
        string name
        string avatar "optional"
        enum role "user | admin"
        boolean isActive
        Date createdAt
        Date updatedAt
    }

    CONTACTS {
        ObjectId _id PK
        string name
        string email
        enum subject "general | demo | support | partnership"
        string message
        ObjectId userId FK "ref: Users"
        enum status "new | read | replied | archived"
        boolean isRead
        string ipAddress
        string userAgent
        Date createdAt
        Date updatedAt
    }

    USERS ||--o{ CONTACTS : "submits"
```

---

## 5. Deployment Architecture — Mermaid Diagram

```mermaid
graph LR
    subgraph Internet
        User["User Browser"]
    end

    subgraph Vercel["Vercel (CDN + Edge)"]
        StaticFiles["React SPA<br/>Static HTML/JS/CSS"]
    end

    subgraph Render["Render (Node.js)"]
        API["Express API Server<br/>+ Socket.IO"]
    end

    subgraph MongoDB["MongoDB Atlas"]
        DB[(Database)]
    end

    subgraph Google["Google Cloud"]
        OAuth["OAuth 2.0"]
    end

    User -->|"HTTPS"| StaticFiles
    StaticFiles -->|"REST API + WebSocket"| API
    API -->|"Mongoose"| DB
    API <-->|"OAuth 2.0"| OAuth

    style Vercel fill:#000,color:#fff,stroke:#fff
    style Render fill:#46e3b7,stroke:#333
    style MongoDB fill:#47a248,color:#fff,stroke:#333
    style Google fill:#4285f4,color:#fff,stroke:#333
```

---

## 6. AI Prompt for Architecture Diagram Generation

Use this prompt with ChatGPT, Claude, or other AI tools to generate a custom architecture diagram:

> **Prompt:**
>
> Generate a professional architecture diagram for a full-stack web application called "TechFlow" with these specifications:
>
> **Frontend (deployed on Vercel):**
> - React 18 with TypeScript and Vite build tool
> - Tailwind CSS for styling, Framer Motion for animations
> - React Router DOM for client-side routing (Home, Login, Register, Dashboard)
> - Axios for HTTP requests to the backend API
> - Socket.IO client for real-time WebSocket communication
> - Zustand-style AuthContext for state management
> - React Hook Form + Zod for form validation
>
> **Backend (deployed on Render):**
> - Node.js with Express 4.18 and TypeScript
> - Security middleware stack: Helmet, CORS, express-rate-limit (tiered: general 100/15min, auth 20/15min, contact 5/15min), express-mongo-sanitize, HPP, XSS-clean
> - Authentication: Passport.js with Google OAuth 2.0 strategy + JWT strategy, bcryptjs for password hashing
> - RESTful API with routes: /api/auth/* (register, login, google, me, logout) and /api/contact/* (CRUD, stats, export CSV)
> - Socket.IO server for real-time events with user-specific rooms (user:<userId>)
> - Winston logger with console and file transports
> - Nodemailer for email notifications (Gmail SMTP)
> - MongoDB Change Streams for real-time data watching
>
> **Database (MongoDB Atlas):**
> - Two collections: `users` (email, password, googleId, name, avatar, role) and `contacts` (name, email, subject, message, userId reference, status)
> - Per-user data isolation: contacts are scoped by userId in all queries
>
> **Key flows to show:**
> 1. User registers/logs in → JWT issued → stored in localStorage → sent as Bearer token
> 2. Google OAuth: redirect to Google → callback → JWT issued → redirect to client
> 3. Contact form submitted → saved to MongoDB with userId → Socket.IO emits to user room → Dashboard updates in real-time
> 4. Polling fallback: 15-second HTTP polling when WebSocket is unavailable
>
> Style the diagram with Google-inspired colors (blue #1a73e8, green #34a853, yellow #f59e0b, red #ea4335). Use clean, modern formatting suitable for a project report or portfolio.
