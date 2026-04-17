🛡️ Next.js & CouchDB Authentication System
This project is a modern, API-first authentication layer built with Next.js (App Router) and CouchDB. The goal is to create a robust system that works seamlessly across Web and Mobile (Native) platforms without relying on built-in database auth or third-party session providers.

my-app/
├── 📁 app/                     # Next.js App Router (Routing & Pages)
│   ├── 📁 api/                 # Server-side API Routes (Backend)
│   │   └── 📁 auth/            # Authentication Endpoints
│   │       ├── 📁 login/       # POST: User sign-in & JWT issuance
│   │       │   └── route.ts
│   │       └── 📁 register/    # POST: User registration & Password hashing
│   │           └── route.ts
│   ├── 📁 dashboard/           # Protected UI (Visible only after login)
│   │   └── page.tsx
│   ├── layout.tsx              # Root Layout (Main wrapper, fonts, metadata)
│   └── page.tsx                # Landing Page (The entry point)
│
├── 📁 lib/                     # Shared Utilities & Configurations
│   └── couchdb.ts              # CouchDB (Nano) client initialization
│
├── 📁 public/                  # Static assets (Images, icons, fonts)
│
├── 📄 .env.local               # Environment Variables (Secrets - ignored by Git)
├── 📄 .gitignore               # List of files to be excluded from version control
├── 📄 middleware.ts            # Global Auth Guard (Request interception)
├── 📄 next.config.ts           # Next.js framework configuration
├── 📄 package.json             # Project dependencies and scripts
├── 📄 README.md                # Technical documentation (The project's face)
└── 📄 tsconfig.json            # TypeScript compiler configuration

🚀 Current Status: Phase 1 (Foundation)
We have successfully implemented the core authentication flow focusing on security and scalability.

What has been done:
Database Integration: CouchDB is deployed via Docker and connected to the Next.js app using nano.

Secure Registration:

Passwords are encrypted using bcrypt (10 salt rounds).

User documents are indexed by email as _id to ensure uniqueness.

Token-Based Login:

Implemented a /api/auth/login endpoint.

Generates JWT (JSON Web Tokens) using the jose library.

Security Headers:

JWTs are currently issued via HTTP-Only, SameSite: Strict cookies to protect against XSS and CSRF.

Route Protection:

A global Middleware intercepts requests to /dashboard/*.

It performs real-time JWT verification before allowing access.

API-First Design: The backend logic is decoupled from the UI, making it ready for mobile integration.

🛠 Tech Stack
Framework: Next.js 15+ (App Router)

Language: TypeScript

Database: CouchDB 3.4.2 (Dockerized)

Security: JWT (jose), Bcrypt, Middleware protection

📅 Roadmap: Phase 2 (Advanced Auth Architecture)
Following the mentor's requirements, the next session will focus on:

Dual-Token System:

Switch to Short-lived Access Tokens (15 min) for security.

Implement Long-lived Refresh Tokens for persistent sessions.

Session Management:

Create a sessions collection in CouchDB.

Track active devices/sessions (One refresh token per device).

Token Rotation:

Add a /api/auth/refresh endpoint to renew access tokens without re-logging.

Advanced Security:

Implement Bearer Token support in headers (for mobile apps).

Device-aware logout (Ability to revoke specific sessions).

📦 Infrastructure
The project uses Docker for local development.

CouchDB Configuration:

YAML
services:
  couchdb:
    container_name: next-couchdb
    image: couchdb:3.4.2
    environment:
      - COUCHDB_USER=${COUCHDB_USER}
      - COUCHDB_PASSWORD=${COUCHDB_PASSWORD}
    ports:
      - "5984:5984"
    volumes:
      - couchdb_data:/opt/couchdb/data
    restart: always
How to Run
Start Database: docker-compose up -d

Install Deps: pnpm install

Run App: pnpm dev

Test: Access http://localhost:3000 and try navigating to /dashboard.