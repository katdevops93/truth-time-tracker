# Tech Stack Document for truth-time-tracker

This document explains the technology choices behind **truth-time-tracker**, a web application for precise time tracking and productivity insights. It’s written in everyday language so anyone can understand how each technology contributes to the project.

## 1. Frontend Technologies

These are the tools and libraries used to build the user interface and client-side logic:

- **Next.js (App Router)**  
  Provides a modern React framework with support for server-side rendering (SSR), static site generation (SSG), and built-in API routes. Improves performance and SEO while keeping code organized.
- **React & TypeScript**  
  React powers interactive UI components; TypeScript adds type safety, reducing bugs and making the codebase easier to maintain.
- **Shadcn/ui (built on Radix UI)**  
  A customizable, accessible component library that speeds up UI development and ensures a consistent look and feel.
- **Tailwind CSS**  
  A utility-first CSS framework that lets us style components quickly and consistently without writing custom CSS classes.
- **TanStack React Query**  
  Manages data fetching, caching, and synchronization with the backend. Ensures the app always displays the most up-to-date information with minimal loading delays.
- **React Context API**  
  Shares global state (such as the user’s session details) across components without prop drilling.
- **Framer Motion**  
  Adds smooth animations and transitions that make the interface feel more responsive and engaging.
- **Clerk (Client-side SDK)**  
  Handles user sign-up, sign-in, and profile management, keeping authentication secure and easy to integrate into the UI.

**How these enhance UX:**  
Using Next.js with React Query and TypeScript ensures fast, reliable page loads and data updates. Shadcn/ui and Tailwind CSS let us craft a clean, accessible design quickly. Framer Motion adds subtle animations that guide users through tasks without slowing them down.

## 2. Backend Technologies

The server-side logic, database interaction, and business rules are built with these components:

- **Next.js API Routes**  
  Serverless functions that live alongside the frontend code. Handle all CRUD operations and business logic without the need for a separate server.
- **Node.js Runtime & TypeScript**  
  Executes API routes on Vercel’s serverless platform. TypeScript provides strong typing for request handlers and utilities.
- **Supabase (PostgreSQL)**  
  A managed PostgreSQL database service with built-in authentication and row-level security. Stores time entries, user profiles, daily notes, and subscription data.
- **Prisma ORM**  
  A type-safe query builder that simplifies database interactions and manages schema migrations. Ensures our database queries are reliable and maintainable.

**Working together:**  
When a user starts a timer, the frontend calls a Next.js API route. That route uses Prisma to write the start time into Supabase. React Query then fetches that updated information and the timer UI updates in real time.

## 3. Infrastructure and Deployment

How the application is hosted, versioned, and delivered to users:

- **Vercel Hosting**  
  Automatically deploys the Next.js app and serverless functions with each code push. Offers global CDN distribution for fast page loads.
- **Git & GitHub**  
  Version control and code collaboration happen in a GitHub repository. Pull requests, code reviews, and branching strategies keep the team in sync.
- **CI/CD Pipeline (Vercel)**  
  Every commit to the main branch triggers an automated build and deployment. Preview deployments for pull requests let stakeholders review changes before merging.
- **Environment Management**  
  Securely stores API keys and database credentials in environment variables, ensuring sensitive data never appears in code.

**Benefits:**  
This setup guarantees that every change is tested and deployed quickly and reliably. It scales automatically as user demand grows, and rollbacks are simple if a deployment issue arises.

## 4. Third-Party Integrations

External services that add functionality without reinventing the wheel:

- **Clerk**  
  Manages authentication, user profiles, multi-factor login flows, and secure sessions.
- **Stripe**  
  Powers subscription plans, billing cycles, and payment processing. Webhooks from Stripe keep our database in sync with the user’s subscription status.
- **Supabase Client Libraries**  
  Used for authenticated database operations and real-time updates when row-level security rules change.

**How they help:**  
Clerk and Stripe allow us to focus on core features while relying on proven services for user management and payments. Webhooks ensure that billing events (like plan upgrades) are handled automatically without user intervention.

## 5. Security and Performance Considerations

Measures taken to protect user data and keep the app running smoothly:

- **TypeScript Everywhere**  
  Catches errors at development time, reducing runtime issues in production.
- **Authentication Middleware**  
  Next.js middleware enforces that only authenticated users can access time-tracking routes and data.
- **Row-Level Security (RLS)**  
  Supabase’s RLS policies ensure users can only read and write their own time entries and notes.
- **React Query Optimization**  
  Caches data and performs background refetching, minimizing unnecessary network requests and keeping the UI responsive.
- **Serverless Scalability**  
  Vercel automatically scales API routes based on incoming traffic, preventing slowdowns under load.
- **Data Validation (Future Recommendation)**  
  Adding a library like Zod for request validation would further guard against malformed data (already identified as a best practice).

## 6. Conclusion and Overall Tech Stack Summary

truth-time-tracker combines modern, battle-tested technologies to deliver a secure, fast, and user-friendly time-tracking experience:

- Frontend built with **Next.js**, **React**, **TypeScript**, **Shadcn/ui**, and **Tailwind CSS** for a polished and maintainable UI.
- Backend handled by **Next.js API routes**, **Prisma**, and **Supabase** for seamless data management.
- Hosted on **Vercel** with **GitHub** version control and automated CI/CD for reliable deployments.
- **Clerk** and **Stripe** integrations streamline authentication and billing, letting the team focus on core features.
- Strong security via middleware, row-level database policies, and type safety; high performance through caching, serverless scaling, and optimized rendering.

Together, these choices align perfectly with the project’s goal of providing an accurate, real-time time-tracking platform that’s both easy to use and easy to maintain. The unified Next.js ecosystem, combined with specialist services like Clerk and Stripe, sets this app apart by offering a cohesive developer experience and a robust, scalable product for end users.