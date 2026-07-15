## __Building the UI/UX For the Dashboard `Views`/`Sections`__

> What we want to end up with essentially is this structure:

components
└── dashboard
    ├── dashboard-shell.tsx
    │
    ├── views
    │   ├── jobs-view.tsx
    │   ├── resume-view.tsx
    │   ├── profile-view.tsx
    │   └── application-status-view.tsx
    │
    ├── resume-onboarding-dialog.tsx
    │
    └── profile
        ├── personal-information-form.tsx
        ├── skills-form.tsx
        ├── experience-form.tsx
        ├── education-form.tsx
        ├── projects-form.tsx
        └── certifications-form.tsx

> So instead of this: `Dashboard Page`

Think of it as:

Dashboard
│
├── Jobs View
├── Resume View
├── Profile View
└── Application Status View

The URL remains: `/dashboard`, while only the content area changes.

- We will also be using `nested routes`

app/
└── dashboard/
    ├── page.tsx                → redirects to /dashboard/jobs
    ├── layout.tsx              → sidebar + header
    ├── jobs/page.tsx
    ├── resume/page.tsx
    ├── profile/page.tsx
    └── status/page.tsx

- This approach gives you several benefits:
    > Each section has its own URL (/dashboard/profile, /dashboard/resume, etc.).
    > Browser back/forward navigation works naturally.
    > Refreshing the page keeps you on the same section.
    > You can link directly to a specific section, such as after parsing completes.
    > It's the pattern the Next.js App Router is designed around.


## 🚀Phase 2 — Dashboard Architecture Refactor
---
What we are working towards is:

app
└── dashboard
    ├── layout.tsx
    ├── page.tsx
    ├── jobs
    │   └── page.tsx
    ├── resume
    │   └── page.tsx
    ├── profile
    │   └── page.tsx
    └── status
        └── page.tsx

- Notice:
    > layout.tsx becomes the permanent dashboard layout.
    > Only the page content changes.

