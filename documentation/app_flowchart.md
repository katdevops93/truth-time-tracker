flowchart TD
    A[User Access App] --> B[Clerk Authentication Flow]
    B --> C[Dashboard]
    C --> D[Time Tracker Component]
    D --> E[Sessions API]
    E --> F[Prisma and Supabase DB]
    D --> G[Stop Timer Action]
    C --> H[Daily Notes Component]
    H --> I[Notes API]
    I --> F
    C --> J[Performance Dashboard]
    J --> K[Aggregated Data Query]
    K --> F
    C --> L[Subscription Management UI]
    L --> M[Stripe API]
    M --> N[Webhook Endpoint]
    N --> O[Subscription Status Update]
    O --> L