# Frontend Guideline Document for truth-time-tracker

This document outlines the frontend architecture, design principles, styling, component structure, state management, routing, performance optimizations, testing strategies, and overall summary of the `truth-time-tracker` application. It is written in everyday language so everyone can understand how the frontend is built and maintained.

## 1. Frontend Architecture

### 1.1 Overview
- Framework: Next.js (App Router) provides page routing, server-side rendering (SSR), static site generation (SSG), and built-in API routes in one unified codebase.  
- Language: TypeScript is used everywhere for type safety, catching errors early and improving code quality.  
- UI Library: Shadcn/ui (built on Radix UI primitives) for accessible, customizable base components.  
- Styling: Tailwind CSS brings utility-first styling for rapid, consistent UI development.  
- State Management: TanStack React Query handles data fetching, caching, and background syncing. React Context API is used for shared UI state (e.g., theme, auth status).  
- Animations: Framer Motion powers smooth transitions and micro-interactions.  
- Authentication: Clerk manages user signup, login, and sessions on both client and server.  

### 1.2 Scalability, Maintainability, Performance
- **Scalability:** Next.js API routes and serverless functions scale automatically. Modular folders (`app/`, `components/`, `lib/`, `hooks/`) make it easy to grow features without tangled code.  
- **Maintainability:** TypeScript types, clearly separated UI and data logic, and small reusable components mean teams can work on features in isolation.  
- **Performance:** React Query’s caching and Next.js’s hybrid rendering (SSR/SSG) deliver fast first loads and snappy updates. Lazy loading and code splitting further reduce bundle sizes.

## 2. Design Principles

### 2.1 Key Principles
- **Usability:** Interfaces are intuitive. Common actions like starting/stopping the timer or adding notes require minimal clicks and clear feedback.  
- **Accessibility:** All interactive elements follow WAI-ARIA guidelines via Radix UI and Shadcn/ui. Keyboard navigation and screen reader labels are standard.  
- **Responsiveness:** The layout adapts seamlessly from mobile to desktop, using Tailwind’s responsive utility classes.  
- **Consistency:** Design tokens (colors, spacing, typography) and shared components ensure a unified look and feel.

### 2.2 Applying Principles
- Buttons, inputs, and forms use consistent padding, font sizes, and focus states.  
- Dashboard charts and tables resize or reflow based on screen size.  
- Error messages and success toasts follow the same style across all pages.  
- Color contrast meets WCAG AA standards for legibility.

## 3. Styling and Theming

### 3.1 Styling Approach
- **Utility-First with Tailwind CSS:** We use Tailwind’s classes directly in JSX for margins, colors, typography, and layout. This keeps CSS files minimal.  
- **No BEM/SMACSS:** Tailwind’s atomic classes replace traditional CSS methodologies—no global class name collisions or long stylesheets.  
- **Dark & Light Mode:** Tailwind’s `dark:` variant toggles styles. Theme state is managed in Context and stored in `localStorage`.  

### 3.2 Theming
- A central `theme.ts` exports color and spacing tokens.  
- CSS variables define primary/secondary colors and can be overridden for custom themes.  

### 3.3 Visual Style
- Style: Modern flat design with subtle glassmorphism for modals and cards (light background blur, slight transparency).  
- Color Palette:
  • Primary: #3B82F6 (blue-500)  
  • Secondary: #10B981 (green-500)  
  • Accent: #8B5CF6 (purple-500)  
  • Neutral Light: #F3F4F6 (gray-100)  
  • Neutral Dark: #1F2937 (gray-800)  
  • Error: #EF4444 (red-500)  
  • Success: #22C55E (green-400)  

- Typography:
  • Font Family: Inter, system-ui fallback.  
  • Headings: Semi-Bold, scale from 2xl to base.  
  • Body Text: Regular 16px for readability.

## 4. Component Structure

### 4.1 Organization
- **app/**: Next.js App Router pages, layouts, and API routes.  
- **components/app/**: Page-specific components (TimeTracker, DailyNotes, Dashboard).  
- **components/ui/**: Reusable building blocks (Button, Input, Modal) from Shadcn/ui.  
- **components/providers/**: Context providers (Clerk client, Theme provider).  
- **hooks/**: Custom React hooks (e.g., useTimeTracking, useDailyNotes).  

### 4.2 Reusability
- Each UI component is small and focused—easy to test and reuse.  
- Props drive variations (e.g., `<Button variant="primary" size="sm" />`).  
- Shared layout wrappers (MainLayout, AuthLayout) enforce consistent page structure.

## 5. State Management

### 5.1 Data Fetching & Caching
- **React Query:** Fetches from Next.js API routes (`/api/sessions`, `/api/notes`), caches results, handles background refetching, and supports optimistic updates for instant UI feedback.

### 5.2 Global UI State
- **React Context:** Manages theme (dark/light), authenticated user data from Clerk, and optional UI flags (e.g., isSidebarOpen).  
- Context providers wrap the root layout so that any component can access shared state without prop drilling.

## 6. Routing and Navigation

### 6.1 Next.js App Router
- Folder-based routing inside `app/`.  
- Each folder can have its own `layout.tsx` for nested layouts, and `page.tsx` for the actual page content.  
- API routes live under `app/api/` for serverless functions (sessions, notes, webhooks).

### 6.2 Navigation Structure
- **Public Routes:** `/sign-in`, `/sign-up`.  
- **Protected Routes:** `/dashboard`, `/dashboard/weekly-report`, etc., guarded by Clerk middleware.  
- Link components from `next/link` handle client-side navigation for fast transitions.

## 7. Performance Optimization

- **Code Splitting:** Next.js automatically splits code per route. For large components, use dynamic imports with `React.lazy`/`Suspense`.  
- **Lazy Loading:** Images served via `next/image` for optimized loading, responsive sizing, and built-in lazy loading.  
- **Asset Optimization:** Tailwind’s `@apply` reduces repeated CSS. Fonts are self-hosted or loaded via `next/font` for minimal layout shift.  
- **Memoization:** Use `React.memo` and `useMemo` where heavy computations occur (e.g., chart data processing).  
- **Prefetching:** Next.js prefetches linked pages on hover for instant loads.

## 8. Testing and Quality Assurance

### 8.1 Unit and Integration Tests
- **Jest & React Testing Library:** Cover components, hooks, and utility functions.  
- Focus on critical logic in `TimeTracker`, `DailyNotes`, and API calling hooks.

### 8.2 End-to-End Tests
- **Cypress:** Simulate user flows: sign-up, login, start/pause timer, add notes, view dashboard.  
- Run in CI on every pull request to catch regressions.

### 8.3 Linting and Formatting
- **ESLint:** Enforces code style and catches common errors.  
- **Prettier:** Auto-formats code on save/commit.  
- **Tailwind CSS Linter:** Validates class names.

### 8.4 Accessibility Checks
- **axe-core** integrated in tests or run via Lighthouse audits to ensure WCAG compliance.

## 9. Conclusion and Overall Frontend Summary

The `truth-time-tracker` frontend leverages a modern, modular stack—Next.js for unified frontend/backend, TypeScript for safety, Tailwind for styling, Shadcn/ui for accessible components, and React Query for smooth data handling. Design principles of usability, accessibility, and responsiveness guide every UI decision. The component-based structure, clear naming conventions, and centralized theme tokens make the code easy to maintain and scale. Performance optimizations and robust testing ensure a polished user experience. In short, this setup delivers a powerful, maintainable, and user-friendly time tracking application that can grow with the team and user needs.