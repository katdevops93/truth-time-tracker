flowchart TD
    A[User] --> B[Landing Page]
    B --> C{User Authenticated?}
    C -- Yes --> D[Dashboard]
    C -- No --> E[Login Page]
    E --> F[Submit Credentials]
    F --> G[Auth API Route]
    G --> H{Credentials Valid?}
    H -- Yes --> D
    H -- No --> I[Display Auth Error]
    D --> J[View Time Entries]
    D --> K[Create Time Entry]
    K --> L[Time Entry Form]
    L --> M[Time Entries API Route]
    M --> N[Save To Database]
    N --> O[Return Response]
    O --> D
    M --> P[Trigger Webhook]
    P --> Q[Webhook API Route]
    Q --> R[Process Webhook Event]
    R --> S[Update Entries]
    S --> D