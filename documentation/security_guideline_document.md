# Security Guidelines for truth-time-tracker

This document outlines the security best practices and controls tailored for the `truth-time-tracker` web application. Adhering to these guidelines will help ensure robust protection of user data, services, and infrastructure.

---

## 1. Core Security Principles

- **Security by Design**: Embed security at every stage—from design and implementation to testing and deployment.
- **Least Privilege**: Grant the minimum permissions required for each component, user, and service.
- **Defense in Depth**: Layer multiple controls so that the failure of one does not compromise the entire system.
- **Fail Securely**: Ensure error conditions do not leak sensitive information or leave resources exposed.
- **Secure Defaults**: Ship with safe settings and require explicit opt-in for any weaker configuration.

---

## 2. Authentication & Access Control

### 2.1 Robust Authentication

- Use Clerk’s client- and server-side SDKs to handle sign-up, sign-in, password resets, and session validation.
- Enforce Multi-Factor Authentication (MFA) for elevated roles (e.g., administrators).
- Reject any API request without a valid Clerk token. Validate tokens in middleware (`middleware.ts`).

### 2.2 Session Management

- Store session tokens in cookies with the attributes: `HttpOnly`, `Secure`, and `SameSite=Strict`.
- Configure both idle and absolute session timeouts (e.g., idle: 15 min, absolute: 24 hrs).
- Protect against session fixation by regenerating session identifiers on privilege changes.

### 2.3 Role-Based Access Control (RBAC)

- Define roles (`user`, `admin`, etc.) in Clerk metadata or database tables.
- Enforce server-side checks in Next.js API routes; never trust client-side role hints.
- Use Supabase Row-Level Security (RLS) policies to restrict data access to the owning user.

---

## 3. Input Handling & Processing

### 3.1 Schema Validation

- Adopt a schema validation library (e.g., Zod) in every API route.
- Example for a session start endpoint:
  ```ts
  const StartSessionSchema = z.object({
    taskId: z.string().uuid(),
    metadata: z.object({ notes: z.string().max(1000) }).optional(),
  });
  ```
- Reject requests that fail validation with generic 4xx responses.

### 3.2 Prevent Injection Attacks

- Use Prisma’s parameterized queries—never interpolate raw values into SQL.
- Sanitize any dynamic Webhook payload before processing. Validate expected event types and IDs.

### 3.3 Cross-Site Scripting (XSS)

- Escape all user-supplied text in React components. Use a library like `DOMPurify` if sanitizing rich text.
- Enforce a strict Content Security Policy (CSP) to prevent inline scripts.

### 3.4 File Uploads

- If files are supported (e.g., images in notes), validate content type, size, and scan for malware.
- Store uploads in a private bucket or outside the webroot with signed URLs for access.

---

## 4. Data Protection & Privacy

### 4.1 Encryption

- Enforce TLS 1.2+ for all traffic. Redirect HTTP to HTTPS at the edge (Vercel or reverse proxy).
- Enable encryption at rest in the Supabase/PostgreSQL instance (e.g., AES-256).

### 4.2 Sensitive Data Handling

- Never log or expose full PII in server logs or error messages.
- Mask or truncate sensitive fields (e.g., partial email addresses) in audit logs.

### 4.3 Secrets Management

- Store API keys, database credentials, and Stripe secrets in a secure vault (e.g., Vercel Environment Variables, AWS Secrets Manager).
- Rotate secrets periodically and on suspected compromise.

---

## 5. API & Service Security

- **HTTPS Only**: Enforce TLS; disable any non-encrypted endpoints.
- **Rate Limiting**: Implement rate limits on Next.js API routes (e.g., `@upstash/ratelimit` or custom middleware) to mitigate brute-force and DDoS.
- **CORS Policies**: Restrict to trusted origins. Example:
  ```js
  const cors = Cors({
    origin: [process.env.APP_URL],
    methods: ['GET','POST','PUT','DELETE'],
  });
  ```
- **Minimal Data Exposure**: Return only necessary fields in API responses (avoid transmitting internal IDs or secrets).
- **HTTP Verbs**: Use GET for reads, POST for creates, PUT/PATCH for updates, DELETE for removals.
- **Versioning**: Prefix API routes with `/v1/` to allow future evolution without breaking clients.

---

## 6. Web Application Security Hygiene

- **CSRF Protection**: Use anti-CSRF tokens (e.g., `next-csrf`) on all state-changing requests.
- **Security Headers**: Configure headers via Next.js `headers()` in `next.config.js`:
  - `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`
  - `X-Frame-Options`: `DENY`
  - `X-Content-Type-Options`: `nosniff`
  - `Referrer-Policy`: `strict-origin-when-cross-origin`
  - `Content-Security-Policy`: define `default-src`, `script-src`, `style-src`, etc.
- **Cookie Attributes**: Ensure `Secure`, `HttpOnly`, and `SameSite` on all session and CSRF cookies.

---

## 7. Infrastructure & Configuration Management

- **Harden Servers**: Disable unused features and ports on any custom servers or VMs.
- **Disable Debug in Production**: Ensure `next dev` and `debug` flags are never enabled in production builds.
- **Secure TLS Configuration**: Use modern cipher suites; disable SSLv3 and TLS<1.2.
- **File Permissions**: Restrict file system access so that application code cannot modify sensitive directories at runtime.

---

## 8. Dependency Management

- Maintain a lockfile (`package-lock.json`) to prevent unexpected upgrades.
- Integrate SCA tools (e.g., GitHub Dependabot, Snyk) to scan for CVEs in both direct and transitive dependencies.
- Review and update dependencies regularly, especially security patches for Next.js, React, Prisma, and Supabase.

---

## 9. Feature-Specific Security Considerations

### 9.1 Time Tracking & Sessions
- Validate the user’s ownership of a session before allowing pause/resume/stop.
- Prevent overlapping sessions by enforcing a database constraint or application-level check.

### 9.2 Daily Notes
- Limit note length and sanitize rich text inputs.
- Use RLS policies so each user can only access their own notes.

### 9.3 Webhooks (Stripe)
- Verify webhook signatures using Stripe’s signing secret.
- Implement idempotency to avoid duplicate events (e.g., track `event.id`).

### 9.4 Subscription Management
- Verify subscription status on each protected request.
- Use Stripe’s `customer.subscription.updated` events to reconcile states; never trust client-provided plan data.

---

## 10. Monitoring, Logging & Incident Response

- Centralize logs in a secure service (e.g., Sentry, Elasticsearch + Kibana).
- Log authentication successes/failures, permission denials, and critical errors without logging sensitive fields.
- Establish an incident response plan:
  1. Detect and contain
  2. Eradicate root cause
  3. Recover services
  4. Review and improve

---

By following these security guidelines, the `truth-time-tracker` application will be better positioned to protect user data, maintain service integrity, and comply with industry best practices.
