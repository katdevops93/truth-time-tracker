# Frontend Guideline Document

This document explains how the frontend of the **truth-time-tracker** application is built, why certain choices were made, and how to work with the codebase. It uses simple language so anyone—technical or not—can understand the setup.

## 1. Frontend Architecture

### 1.1 Overview
- **Framework:** Next.js (with the App Router) brings together pages, layouts, server-side code, and API routes in one framework.
- **Rendering Modes:** Server-Side Rendering (SSR), Static Site Generation (SSG), and Incremental Static Regeneration (ISR) for fast page loads and search-friendly content.
- **Language:** TypeScript ensures every variable and function is typed, reducing errors and making the code easier to read.
- **Styling:** Global stylesheet (`globals.css`) for base styles, plus component-level CSS modules for specific components.
- **API Routes:** Folder- and file-based serverless endpoints under `/app/api`, such as `webhooks/route.ts`, let the frontend handle webhooks and backend logic without spinning up a separate server.
- **Custom Fonts:** Font files in `/app/fonts` are preloaded for a consistent typographic style.
- **Tooling Rules:** A `.cursor/rules` directory enforces documentation and coding standards.

### 1.2 Scalability & Maintainability
- **File-Based Routing & Co-located Code:** Each page’s layout, styles, and logic live together, making features easy to find and update.
- **Component-Based Architecture:** Rather than monolithic pages, we build small, reusable pieces (buttons, cards, forms). This mirrors how users think about the UI and makes changes isolated and safe.
- **TypeScript Everywhere:** Types act as living documentation—new developers can see what data looks like and how it flows through the app.

### 1.3 Performance
- **Built-In Optimizations:** Next.js automatically code-splits pages and routes, only sending the JavaScript needed for each view.
- **Image & Font Optimization:** Custom fonts are served efficiently; any images can use the built-in `<Image>` component for lazy loading and resizing.
- **Edge Caching:** API routes and pages can be cached at the edge for lightning-fast responses.

## 2. Design Principles

1. **Usability:** Simple forms and clear buttons guide users through time entry and reporting without confusion.
2. **Accessibility:** We use semantic HTML (`<button>`, `<nav>`, `<label>`), proper ARIA attributes, and keyboard-friendly navigation to support screen readers and keyboard-only users.
3. **Responsiveness:** A mobile-first CSS approach ensures the app works on phones, tablets, and desktops. Breakpoints adjust layouts (e.g., stacked cards on mobile vs. grid on desktop).
4. **Consistency:** Shared spacing, color usage, and typography across the app create a cohesive experience.

These principles appear in every UI component—from high-contrast button states for readability to clear error messages in forms.

## 3. Styling and Theming

### 3.1 Styling Approach
- **CSS Modules:** Component-specific `.module.css` files keep styles local by default, avoiding class-name collisions.
- **Global Styles:** `globals.css` establishes reset rules, typography base, and layout containers.
- **Methodology:** A simple BEM-inspired naming (e.g., `.Card__header`, `.Form__input`) makes intent clear.

### 3.2 Theming
- **Light & Dark Mode:** A React Context provides theme state (`light` or `dark`) to components. CSS custom properties (`--color-primary`) adjust dynamically in the global stylesheet.

### 3.3 Visual Style
- **Overall Look:** Modern flat design with subtle glassmorphism effects on cards (a semi-transparent background and soft shadows).
- **Color Palette:**
  - Primary: #4F46E5 (indigo)
  - Secondary: #10B981 (emerald)
  - Accent: #F59E0B (amber)
  - Background (light): #FFFFFF
  - Background (dark): #1F2937
  - Text (dark): #111827
  - Text (light): #F9FAFB
- **Typography:** Inter (system-fallback: `-apple-system, BlinkMacSystemFont, 'Segoe UI'`). Headings are bold and clear; body text is regular for readability.

## 4. Component Structure

- **Directory Layout:**
  - `/app/` – pages, layouts, and API routes.
  - `/components/` – shared UI pieces (Button, Card, Modal, TimeEntryForm, Navbar).
  - `/contexts/` – React Context providers (ThemeContext, AuthContext).
  - `/styles/` – global CSS and variables.
- **Reusability:** Each component accepts props for customization (e.g., `<Button variant="primary" onClick={…}/>`), reducing duplicate code.
- **Atomic Approach:** Start with small “atoms” (Button, Input), combine into “molecules” (FormField), then “organisms” (TimeEntryList).

Component-based architecture keeps the code maintainable: updating a button style in one file updates every instance.

## 5. State Management

- **React Context API:** Lightweight global state for theming and user authentication.
- **Server Data Fetching:** Next.js server components fetch data directly where possible; client components use React hooks (`useEffect`) or `useSWR` for client-side data caching.
- **Local State:** Component-level state (`useState`) handles UI interactions like open/close modals and form inputs.

This mix ensures data is fresh, shared state is easy, and local UI state stays close to where it’s used.

## 6. Routing and Navigation

- **Next.js App Router:** File-based structure under `/app` maps URLs to layouts and pages automatically.
- **Nested Layouts:** A root layout wraps every page (header, footer). Sub-layouts can wrap groups of pages (e.g., dashboard routes).
- **Linking & Navigation:** The `<Link>` component prefetches pages for instant transitions; dynamic routes (e.g., `[entryId]/edit`) let users drill into specific entries.
- **Fallbacks:** Custom 404 page in `not-found.tsx` and error boundaries ensure graceful failure.

## 7. Performance Optimization

1. **Code Splitting:** Built in—only loads code for the current route.
2. **Lazy Loading Components:** Use `next/dynamic` to defer non-critical UI (e.g., heavy chart libraries).
3. **Image Optimization:** `<Image>` automatically resizes and lazy-loads images.
4. **Font Loading:** Preload critical fonts in `<Head>` to avoid flash of unstyled text.
5. **Caching & Headers:** Leverage Next.js caching headers for assets and API responses.

These strategies reduce initial load time and keep interactions smooth.

## 8. Testing and Quality Assurance

- **Type Checking:** TypeScript flags errors before code runs.
- **Linting & Formatting:** ESLint and Prettier enforce a consistent code style and catch common mistakes.
- **Unit Tests:** Jest + React Testing Library for components and utility functions.
- **Integration Tests:** Test API routes and component interactions (e.g., form submission).
- **End-to-End Tests:** Cypress or Playwright simulate real user flows—logging in, creating time entries, viewing reports.
- **Continuous Integration:** A CI pipeline (GitHub Actions) runs lint, type checks, and all tests on every pull request.

## 9. Conclusion and Overall Frontend Summary

The **truth-time-tracker** frontend combines Next.js, TypeScript, and a clean, component-based approach to deliver a fast, scalable, and easy-to-maintain application. By following these guidelines—modular architecture, clear design principles, consistent styling, and robust testing—new features can be added with confidence, and the user experience will remain smooth and accessible. The integration of serverless API routes for webhooks and the choice of a modern flat/glassmorphic design set this project apart and ensure it’s ready for both internal growth and external integrations.