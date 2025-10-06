# Backend Structure Document: truth-time-tracker

This document provides a clear overview of the backend setup for the truth-time-tracker application. It explains how the system is built, how data is managed, which services are used to host and scale it, and how we keep everything secure and running smoothly.

## 1. Backend Architecture

### Overall Design
- The application uses **Next.js** with its App Router for both the user interface and backend logic. This means pages and server code live in the same project and share many of the same tools.
- **API Routes** (sometimes called serverless functions) handle custom backend tasks like saving time entries or processing webhooks.
- **TypeScript** is used throughout, so we catch many mistakes before the code even runs.

### Scalability, Maintainability, and Performance
- **Scalability:** Every API route runs in a serverless environment (for example, on Vercel). When traffic spikes, the platform automatically spins up more instances—no manual intervention needed.
- **Maintainability:** Co-locating related code (pages, components, and API logic) makes it easier to find and update features in one place.
- **Performance:** Next.js offers built-in support for:
  - **Server-Side Rendering (SSR):** Updated pages generated on each request when data changes frequently.
  - **Static Site Generation (SSG):** Pages built once at deploy time for content that changes rarely.
  - **Incremental Static Regeneration (ISR):** Combines SSR and SSG to update static pages in the background when data changes.

## 2. Database Management

### Current Status and Choice
- At the moment, the project does not include a live database. To store and query user data and time entries, we recommend:
  - **PostgreSQL** (a reliable relational database) paired with
  - **Prisma** (an ORM tool) for easy data modeling and type-safe queries.

### Data Structure and Access
- **Users** sign up or log in, then create and view time entries.
- **Projects** group related time entries.
- **Time entries** record the start, end, and description of each tracked session.
- The backend uses Prisma to translate code operations (for example, “create a new time entry”) into SQL queries behind the scenes.

## 3. Database Schema

#### Human-Friendly Overview
- **Users**
  - Unique identifier
  - Name and email
  - Password hash for security
  - Timestamps for account creation and updates
- **Projects**
  - Unique identifier
  - Title and optional description
  - Owner (which user created it)
  - Timestamps
- **Time Entries**
  - Unique identifier
  - Link to a user and link to a project
  - Description of the work done
  - Start and end times
  - Duration (calculated or stored)
  - Timestamps

#### Example SQL Schema (PostgreSQL)
```sql
CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects (
  id              SERIAL PRIMARY KEY,
  owner_id        INTEGER REFERENCES users(id),
  title           TEXT NOT NULL,
  description     TEXT,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE time_entries (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id),
  project_id      INTEGER REFERENCES projects(id),
  description     TEXT,
  start_time      TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time        TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```  

## 4. API Design and Endpoints

### Approach
- All backend calls use **RESTful** endpoints implemented as Next.js API Routes in the `app/api/` folder.
- JSON is the data format for both requests and responses, making it easy for the frontend and external services to talk to us.

### Key Endpoints
- **User Management**
  - `POST /api/signup` — Create a new user account
  - `POST /api/login` — Log in and receive a session token
- **Project Management**
  - `GET /api/projects` — List the user’s projects
  - `POST /api/projects` — Create a new project
- **Time Entry Management**
  - `GET /api/time-entries` — Fetch a list of entries for a given project
  - `POST /api/time-entries` — Record a new time entry
  - `PUT /api/time-entries/{id}` — Update an existing entry
  - `DELETE /api/time-entries/{id}` — Remove an entry
- **Webhooks**
  - `POST /api/webhooks` — Receive and process external events (for example, automated imports or notifications)

## 5. Hosting Solutions

- We deploy the entire backend and frontend to **Vercel**, the company behind Next.js.
- Benefits:
  - Global **CDN** (Content Delivery Network) for fast content delivery without extra setup.
  - **Automatic scaling** of serverless API functions handling spikes in usage.
  - Built-in **SSL certificates** and simple custom domain setup.
  - Free tier options for small-scale usage, keeping cost low in early stages.

## 6. Infrastructure Components

- **Load Balancing:** Handled automatically by Vercel’s serverless platform—requests route to the nearest healthy instance.
- **CDN:** Static files (styles, fonts, images) and statically generated pages are served from edge locations worldwide.
- **Caching:**
  - Next.js ISR lets us cache pages at the edge and refresh them on a schedule.
  - HTTP cache headers on API responses can be tuned for read-heavy endpoints.
- **Logging & Error Tracking:** Basic logs appear in Vercel’s dashboard. For deeper insights, we integrate with tools like Sentry (see Monitoring).  

## 7. Security Measures

- **Authentication & Authorization:** We recommend using **NextAuth.js** with JSON Web Tokens (JWTs) to protect routes and resources.
- **Data Encryption:**
  - All network traffic uses HTTPS by default on Vercel.
  - PostgreSQL databases on managed services encrypt data at rest.
- **Input Validation:** Libraries like Zod ensure incoming data has the correct shape before it reaches our database.
- **Webhook Security:** Every incoming webhook request must include a known signature or secret header. We verify this before processing.
- **Rate Limiting:** A simple custom middleware can throttle repeated requests to critical endpoints to prevent abuse.

## 8. Monitoring and Maintenance

- **Uptime & Performance:** Vercel provides basic analytics on build times, response latencies, and traffic.
- **Error Tracking:** Integrate **Sentry** or a similar service to capture runtime errors and stack traces.
- **Automated Deployments:** Every commit to the main branch triggers a new build and deploy, ensuring that updates go live quickly and consistently.
- **Database Backups & Migrations:** With Prisma:
  - Automated schema migrations track changes over time.
  - Managed database providers often include daily backups.

## 9. Conclusion and Overall Backend Summary

The truth-time-tracker backend is built on Next.js and TypeScript, combining user interface and server logic in a single framework. Serverless API Routes handle data operations, webhooks, and integrations without dedicated servers. We plan to add PostgreSQL with Prisma ORM for data persistence, ensuring clear data models for users, projects, and time entries.

By hosting on Vercel, we gain automatic scaling, a global CDN, and low operational overhead. Security is enforced through HTTPS, JWT-based authentication, input validation, and webhook signature checks. Monitoring and maintenance focus on automated deployments, error tracking, and performance analytics.

This setup delivers a reliable, scalable, and cost-effective backend that meets the project’s goals of easy time tracking, external integrations, and responsive user experience.