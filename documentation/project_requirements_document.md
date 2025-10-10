# Project Requirements Document (PRD) for truth-time-tracker

## 1. Project Overview

truth-time-tracker is a modern web application that helps individuals and small teams capture, organize, and analyze the time they spend on tasks and projects. At its core, it provides a real-time timer users can start, pause, resume, and stop; a daily notes interface to record accomplishments and context; and a clean dashboard that summarizes daily and weekly productivity. By combining secure authentication, detailed logging, and subscription management, the platform aims to turn raw time data into actionable insights.

We’re building truth-time-tracker to solve two key problems: (1) eliminating manual time-entry errors and guesswork by offering one-click tracking, and (2) providing clear, contextual reports that help users understand where their time really goes. Success for the MVP will be measured by user engagement (daily active timers), accuracy of logged sessions (less than 5% editing), and subscription conversions (trial→paid rate ≥ 10%).

## 2. In-Scope vs. Out-of-Scope

### In-Scope (MVP)
- User sign-up, sign-in, and profile management via Clerk authentication.  
- Real-time timer: start, pause, resume, stop sessions for named tasks.  
- Daily notes: CRUD interface to attach text entries to each day.  
- Dashboard: daily and weekly summaries of time spent, total durations per task, simple bar or line charts.  
- Backend REST API: `/api/sessions`, `/api/notes`, `/api/webhooks`.  
- Data persistence: Supabase (PostgreSQL) with Prisma ORM and Row-Level Security.  
- Stripe subscription billing: trial management, plan changes, webhooks to update user access.  
- Hosting and deployment on Vercel.  
- TypeScript throughout for type safety.  

### Out-of-Scope (Phase 2+)
- Team or project-level sharing/permissions (multiple users per workspace).  
- Detailed analytics (heatmaps, custom date ranges, export to CSV/PDF).  
- Calendar or external calendar integration (Google, Outlook).  
- Mobile-native apps (iOS/Android).  
- Multi-currency or advanced billing (coupons, prorated upgrades).  
- Offline mode or local caching for timer continuity.  

## 3. User Flow

A new user arrives at the landing page and clicks “Sign Up.” They enter their email, choose a password, and verify via Clerk’s authentication dialog. Upon successful sign-in, they land on the main dashboard. At the top, there’s a prominent timer component labeled “Start Timer,” and below it, a note section labeled "Today's Notes." A left sidebar provides links to “Dashboard,” “History,” and “Account Settings.”

To track time, the user types a task name into the timer field and clicks “Start.” The timer ticks in real time, and the “Pause” and “Stop” buttons appear. When they pause or stop, the session is saved automatically. They then scroll down, add context to today’s session in the notes input, and click “Save Note.” On the right, the dashboard chart updates to reflect the new duration. If their trial expires or they want premium charts, they click “Upgrade,” manage their plan in Stripe’s embedded UI, and complete payment. Webhook events keep their subscription status in sync.

## 4. Core Features

- **Authentication & Authorization**  
  • Clerk-powered sign-up, sign-in, session management.  
  • Middleware protection for API routes and pages.

- **Real-Time Timer Component**  
  • Start, pause, resume, stop actions.  
  • Task naming and session metadata (start time, end time).

- **Daily Notes & Activity Logging**  
  • Create, read, update, delete notes per date.  
  • Associate notes with sessions when needed.

- **Dashboard & Reporting**  
  • Aggregated daily/weekly time totals.  
  • Simple bar or line charts (using a lightweight chart library).  
  • Filter by date range (preset: today, this week).

- **Subscription Management**  
  • Stripe integration for trial and paid plans.  
  • Webhook endpoint to update user access on events (invoice.paid, customer.subscription.deleted).

- **Backend API**  
  • Next.js API routes under `/api/` for sessions, notes, webhooks.  
  • Prisma models for `User`, `Session`, `DailyNote`, `Subscription`.

- **Data Layer & Security**  
  • Supabase PostgreSQL with Row-Level Security to ensure users only see their own records.  
  • Type-safe database operations via Prisma.

## 5. Tech Stack & Tools

- **Frontend**  
  • Next.js (App Router) + React  
  • shadcn/ui (Radix UI) + Tailwind CSS  
  • React Query (TanStack) + React Context API  
  • Framer Motion for transitions

- **Authentication**  
  • Clerk (client SDK and server middleware)

- **Backend & Database**  
  • Next.js API Routes (serverless)  
  • Supabase (PostgreSQL)  
  • Prisma ORM  
  • Stripe (Node.js SDK)

- **Hosting & Deployment**  
  • Vercel for frontend and serverless functions

- **Languages & Tooling**  
  • TypeScript, ESLint, Prettier  
  • GitHub Actions (CI/CD)  

## 6. Non-Functional Requirements

- **Performance**:  
  • API response times < 200 ms (typical queries).  
  • First contentful paint < 1.2 s on 3G simulated network.

- **Security & Compliance**:  
  • All sensitive routes protected by Clerk middleware.  
  • HTTPS only, secure cookies, proper CORS settings.  
  • Stripe PCI DSS compliance via hosted checkout.

- **Scalability**:  
  • Serverless functions scale automatically on Vercel.  
  • Supabase can handle thousands of concurrent connections.

- **Usability & Accessibility**:  
  • WCAG 2.1 AA–compliant UI components (Radix + Tailwind).  
  • Keyboard navigation, ARIA labels on key controls.

- **Reliability & Monitoring**:  
  • Uptime target: 99.9%.  
  • Error tracking via Sentry or similar.  
  • Logs retained for 30 days.

## 7. Constraints & Assumptions

- Clerk and Stripe accounts are fully configured and in test/production modes.  
- Supabase project with Row-Level Security enabled.  
- Vercel account linked to GitHub repo for seamless deploys.  
- Assumes users have modern browsers with JavaScript enabled.  
- No offline or mobile-app support in V1.

## 8. Known Issues & Potential Pitfalls

- **API Rate Limits**: Supabase free tier has limits—monitor and consider caching or upgrading.  
- **Webhook Reliability**: Stripe events may retry; ensure idempotency for subscription updates (use event IDs).  
- **Time Zone Handling**: Users in different time zones need consistent session dates—standardize on UTC in the database and convert on the client.  
- **Optimistic Updates**: React Query optimistic UI may display sessions before DB confirmation—handle rollback on errors.  
- **Large Data Sets**: Dashboard queries on long histories could slow down—limit initial date range or implement cursor-based pagination.


---
This PRD fully defines truth-time-tracker’s MVP scope, user flows, features, and technical constraints, serving as the single source of truth for subsequent technical design documents.