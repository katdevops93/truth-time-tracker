# Project Requirements Document (PRD) for "truth-time-tracker"

## 1. Project Overview

The "truth-time-tracker" is a web-based time-tracking application that helps individuals and teams record, manage, and analyze the time they spend on tasks or projects. Users can add new time entries, edit or delete existing ones, view summaries in a dashboard, and connect the app to other services via webhooks. By focusing on simplicity and reliability, the tool aims to replace manual spreadsheets and fragmented trackers.

This project is being built to give knowledge workers, freelancers, and small teams a single place to capture their working hours accurately, generate quick reports, and automate workflows through webhook integrations. Success will be measured by user adoption (number of active users), accuracy of time logs, and reliability of webhook events (measured by delivery and processing rates).

## 2. In-Scope vs. Out-of-Scope

### In-Scope (Version 1)
- User interface for:  
  • Dashboard listing all time entries  
  • Form to create, edit, and delete entries  
  • Start/stop timer widget for live tracking
- Data persistence in a relational database (e.g., PostgreSQL or Supabase) with Prisma ORM
- Next.js API Route `/api/webhooks/route.ts` that accepts, validates, and processes incoming webhook events
- Authentication (email/password or magic link) to secure user data
- Basic reports view (daily and weekly summaries)
- Global layout with header, footer, and responsive design
- Configuration screen where users set a webhook secret and view integration logs
- Automated tests covering unit, integration, and basic end-to-end flows

### Out-of-Scope (Later Phases)
- Advanced billing or invoicing features
- Team and role-based permissions beyond a single user scope
- Mobile app (native iOS/Android) or desktop client
- Multi-tenancy support for large enterprises
- Deep analytics (charts, trends beyond simple summaries)
- Third-party OAuth providers (Google, GitHub, etc.)
- AI-powered time suggestions or auto-tagging

## 3. User Flow

A new user lands on the public homepage and signs up with their email and password (or magic link). After logging in, they see the main dashboard: a table of past time entries with date, project name, duration, and notes. A prominent “+ New Entry” button at the top right opens a form modal where they enter project details, start and end times, and optional notes. Once saved, the entry appears instantly in the table.

If the user prefers live tracking, they click the “Start Timer” button, track the task in real time, and then click “Stop Timer” when done. They can navigate to the “Reports” tab to view daily or weekly summaries. In the “Settings” page, they configure their webhook secret and see a log of incoming webhook events. All interactions happen within a consistent header/sidebar layout that adapts to mobile screens.

## 4. Core Features

- **Authentication & User Management**: Sign up, log in, password reset (magic link or email/password).
- **Dashboard & Time Entries**: List, search, filter, sort, and page through entries.
- **Time Entry Form**: Create/edit/delete entries with fields: project name, start time, end time, duration (auto-calculated), and notes.
- **Live Timer**: Start/stop button to capture current session without manual timestamps.
- **Reports View**: Summarize time spent per day and week, with total hours by project.
- **Webhook Integration**: Protected API endpoint to receive events, validate using HMAC secret, and auto-create or update entries.
- **Settings & Configuration**: UI to manage webhook secrets and view delivery logs.
- **Global Layout & Responsiveness**: Header, navigation, footer, mobile-friendly design.
- **Testing Suite**: Unit tests (Jest), integration tests (React Testing Library), and end-to-end tests (Cypress or Playwright).

## 5. Tech Stack & Tools

- **Frontend**:  
  • Next.js (App Router) with React  
  • TypeScript for type safety  
  • Global CSS + CSS Modules
- **Backend / API**:  
  • Next.js API Routes  
  • TypeScript
- **Database & ORM**:  
  • PostgreSQL (or Supabase)  
  • Prisma ORM
- **Hosting & Deployment**:  
  • Vercel (for serverless functions and SSR)  
  • Environment variables managed via Vercel settings
- **Testing & QA**:  
  • Jest + React Testing Library  
  • Cypress or Playwright for end-to-end tests
- **Developer Tooling**:  
  • VS Code with ESLint and Prettier  
  • Optional: Cursor for documentation consistency

## 6. Non-Functional Requirements

- **Performance**:  
  • First Contentful Paint (FCP) under 1.5s on 3G  
  • API responses under 300ms for common queries
- **Scalability**:  
  • Support up to 10,000 time entries per user  
  • Handle 100 concurrent users without performance degradation
- **Security**:  
  • Webhook endpoint protected by HMAC secret  
  • HTTPS everywhere  
  • Input validation on all forms and API routes  
  • Rate limiting on public endpoints
- **Reliability**:  
  • 99.9% uptime SLA  
  • Automated backups of the database
- **Usability & Accessibility**:  
  • Responsive design (mobile and desktop)  
  • WCAG 2.1 Level AA compliance

## 7. Constraints & Assumptions

- The project uses Next.js App Router, requiring Node.js 18+ and Vercel deployment.
- A managed PostgreSQL (or Supabase) instance is available.
- Users have modern browsers (last two versions of Chrome, Firefox, Safari).
- Webhook providers will sign requests using an HMAC secret for validation.
- Team members are familiar with TypeScript and React.

## 8. Known Issues & Potential Pitfalls

- **Webhook Idempotency**: Receiving duplicate events can create duplicate entries. Mitigation: use unique event IDs and skip repeats.
- **Long-Running Tasks**: Processing heavy webhook payloads in the API route may time out. Mitigation: offload to a background queue (e.g., Redis + Bull).
- **Time Zone Handling**: Users in different time zones could see incorrect durations. Mitigation: store timestamps in UTC and convert on the client.
- **Database Migrations**: Manual schema changes risk downtime. Mitigation: use Prisma’s migration workflow and test on staging.
- **API Rate Limits**: Third-party services may throttle webhook deliveries. Mitigation: implement exponential backoff retries and logging.

---

This PRD captures all major requirements and constraints so that subsequent technical documents (Tech Stack details, Frontend Guidelines, Backend Architecture, etc.) can be generated with no ambiguity. If anything is unclear or new requirements emerge, update this document first.