# Backend Structure Document for truth-time-tracker

## 1. Backend Architecture

The backend of truth-time-tracker is built on a serverless, full-stack JavaScript framework that keeps things simple while allowing us to grow easily.

- We use Next.js API routes for all of our server-side logic. Each route behaves like a mini service that runs only when it’s needed.
- TypeScript ensures that our code stays reliable and easier to read and maintain over time.
- Prisma is our ORM (Object-Relational Mapper). It turns database tables into TypeScript objects so we can work with data safely and with autocomplete.

How it supports our goals:
- Scalability: Serverless functions on Vercel spin up or down automatically based on traffic. We don’t have to manage servers.
- Maintainability: Clear folder structure (`app/api/`, `lib/`, `prisma/`) and type safety with TypeScript reduce bugs and make new features faster to build.
- Performance: Cold starts are minimal on Vercel; also, our use of SSR/SSG in Next.js plus React Query caching keeps pages fast.

## 2. Database Management

We rely on Supabase—a hosted PostgreSQL database with built-in authentication and security features.

- Database type: Relational (PostgreSQL).
- ORM and migrations: Prisma handles schema definitions and migrations.
- Data security: We leverage Supabase’s Row-Level Security (RLS) to ensure each user can only read and write their own records.
- Backup and recovery: Supabase automatically takes daily snapshots of the database, so we can restore data if needed.

## 3. Database Schema

Below is a human-readable overview, followed by SQL definitions for PostgreSQL. All tables use a `user_id` to link data to the correct user.

Tables:
- **users**: Managed by Clerk (no custom table). We store Clerk’s user ID in each record.
- **time_entries**: Tracks when a user starts, pauses, resumes, or stops a timer session.
- **daily_notes**: Stores the written notes that users add each day.
- **subscriptions**: Keeps track of Stripe subscription status and plan details.

PostgreSQL schema (SQL):

```sql
-- time_entries table
CREATE TABLE time_entries (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('running','paused','completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- daily_notes table
CREATE TABLE daily_notes (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  entry_date DATE NOT NULL,
  content TEXT NOT NULL,
  time_entry_id INT REFERENCES time_entries(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- subscriptions table
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```  

## 4. API Design and Endpoints

We follow a RESTful approach with clear, focused endpoints. Each API route lives in `app/api/` and runs as a serverless function.

- **/api/sessions**
  - `POST /start` : Start a new time entry.
  - `POST /pause` : Pause the active time entry.
  - `POST /resume`: Resume a paused entry.
  - `POST /stop`  : Stop and finalize the entry.
  - `GET /`       : List all time entries for the current user.

- **/api/notes**
  - `GET /`       : Retrieve all daily notes for the user.
  - `POST /`      : Create a new daily note.
  - `PUT /:id`    : Update an existing note by its ID.
  - `DELETE /:id` : Remove a note by its ID.

- **/api/webhooks**
  - `POST /`      : Handle incoming Stripe events (subscription updates, payment successes, etc.). We verify the Stripe signature before processing.

- **/api/subscriptions**
  - `GET /`       : Fetch the current subscription status and plan info.

Each endpoint checks the user’s identity using Clerk middleware before running.

## 5. Hosting Solutions

We host on Vercel, which is made for Next.js and serverless functions:

- **Global CDN**: Static assets and pages are cached at the edge around the world.
- **Auto-scaling**: Serverless functions scale to zero when idle and ramp up instantly under load.
- **Cost-effective**: You pay for usage rather than idle server time.
- **Easy deployments**: Push to GitHub and Vercel takes care of building and deploying.

Our database lives on Supabase’s managed cloud service, which provides high availability, automatic backups, and easy scaling.

## 6. Infrastructure Components

- **Load Balancer & CDN**: Built into Vercel. Distributes traffic to the nearest serverless function or edge cache.
- **Serverless Functions**: Each API route is deployed as an isolated function, reducing blast radius and improving reliability.
- **Caching**:
  - Next.js ISR (Incremental Static Regeneration) for pages that can be updated in the background.
  - React Query on the client to cache API responses and minimize network calls.
- **Content Delivery**: Vercel’s Edge Network serves static assets (JS, CSS, images) quickly to users worldwide.

## 7. Security Measures

- **Authentication & Authorization**: Clerk handles user sign-up, sign-in, and tokens. We apply a middleware in `middleware.ts` to protect API routes.
- **Data Protection**:
  - All traffic is encrypted via HTTPS/TLS.
  - Supabase enforces Row-Level Security so users can only access their own rows.
- **Payment Webhooks**: We verify Stripe webhook signatures to prevent fake requests.
- **Environment Variables**: Secrets (Clerk keys, Stripe secret, database URLs) live in Vercel’s secure environment settings.

## 8. Monitoring and Maintenance

- **Logging & Metrics**:
  - Vercel Analytics provides HTTP metrics (latency, error rates).
  - Supabase’s dashboard shows database performance and slow queries.
- **Error Tracking**: We use console logs today, and we plan to add a service like Sentry to capture errors and stack traces.
- **Database Migrations**: Prisma migrations are run during each deployment, ensuring schema changes are applied automatically.
- **Backups**: Supabase takes daily snapshots of the database for point-in-time recovery.
- **Routine Maintenance**: We review usage logs monthly, rotate keys as needed, and apply dependency updates via automated pull requests.

## 9. Conclusion and Overall Backend Summary

truth-time-tracker’s backend is a modern, serverless setup that balances simplicity and power. By using Next.js API routes, Supabase, and Prisma, we get a type-safe, scalable, and maintainable system right out of the box. Vercel ensures our app performs well around the globe without complex server management. Security is baked in through Clerk authentication, Stripe signature checks, and database RLS. Regular monitoring and automated migrations keep the system healthy and ready to grow. This architecture supports our goals of a reliable, performant, and user-friendly time tracking platform.