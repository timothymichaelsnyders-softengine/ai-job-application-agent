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

Instead of rendering placeholder content, it will become:
-----------------------------
|    DashboardShell         |
|                           |
|    Sidebar                |
|    Header                 |
|    ────────────────────   |
|    children               |
|    ────────────────────   |
-----------------------------

It will simply render:

{children}

This is the App Router pattern and keeps things much cleaner.

## Commit 1
---

# Step 1
---
Create:

app/
└── dashboard/
    └── layout.tsx

# Step 2: Implement `layout.tsx`
    |
    |
    V

import { ReactNode } from "react"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

type DashboardLayoutProps = {
    children : ReactNode
}

export default async function DashboardLayout({
    children,
} : DashboardLayoutProps) {
    // create supabase instance
    const supabase = createClient();

    // get the user
    const {
        data : { user }
    } = await supabase.auth.getUser();

    // if there is no user, redirect to sign in
    if(!user) {
        redirect("/sign-in")
    }

    // get user details
    const { data : profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

    // get display name
    const displayName =
        profile?.full_name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User";

    // get initials
    const initials = displayName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    // get Avatar URL
    const avatarUrl =
        profile?.avatar_url ||
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture;

    // check if there is a resume/ if user has onboarded
    const { data: resume } = await supabase
        .from("resumes")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle()

    const needsOnboarding = !resume

    return (
        <DashboardShell
        displayName={displayName}
        initials={initials}
        avatarUrl={avatarUrl}
        userEmail={user.email ?? ""}
        needsOnboarding={needsOnboarding}
        >
            {children}
        </DashboardShell>
    )
}


# Step 3
---
- Modify DashboardShellProps
    > add children : ReactNode

- Change from:

type DashboardShellProps = {
  displayName: string
  initials: string
  avatarUrl?: string | null
  userEmail: string
  needsOnboarding: boolean
}

- To:

type DashboardShellProps = {
  children : ReactNode
  displayName: string
  initials: string
  avatarUrl?: string | null
  userEmail: string
  needsOnboarding: boolean
}

# Step 4 : Update the component signature
- Add `children`

# Step 5 : **This next part is important**
- locate the section that changes every time you click a different menu item : `<div className="flex-1 p-6">`
    - Delete everything in between this div
        - Replace with `{children}`

# Step 6
- `Update` the ``app/dashboard/page.tsx`` to just `redirect`

import { redirect } from "next/navigation"

export default function DashboardPage() {
  redirect("/dashboard/jobs")
}

__NOTE__

At this stage we haven't created the route for `jobs` (dashboard/jobs) so the application won't display anything if we do `step 6`.
For now, keep the code as is on `page.tsx` but `add` the `redirect`.
`Once` we `create` the `page`, we will `comment` `everything` out and `keep` the last `redirect("/dashboard/jobs")`

___END___

__ END OF `COMMIT 1`__



## Commit 2 : Nested Dashboard Routes
---

- Goal:
> We're going from:

Dashboard
    ↓
useState(activeItem)

> to

/dashboard/jobs
/dashboard/resume
/dashboard/profile
/dashboard/status

# Step 1
- Create the following folders and files:
app/
└── dashboard/
    ├── jobs/
    │   └── page.tsx
    ├── resume/
    │   └── page.tsx
    ├── profile/
    │   └── page.tsx
    └── status/
        └── page.tsx

# Step 2 : Create placeholder pages.

> Jobs:

export default function JobsPage() {
  return (
    <div className="flex h-full min-h-[560px] flex-col rounded-[28px] border border-border/70 bg-background/80 p-6 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.35)]">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">
          Jobs
        </h2>

        <p className="text-sm text-muted-foreground">
          Search and manage jobs.
        </p>
      </div>
    </div>
  )
}

> Resume:

export default function ResumePage() {
  return (
    <div className="flex h-full min-h-[560px] flex-col rounded-[28px] border border-border/70 bg-background/80 p-6 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.35)]">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">
          Resume
        </h2>

        <p className="text-sm text-muted-foreground">
          Resume management coming soon.
        </p>
      </div>
    </div>
  )
}

- `Repeat` for `Profile` and `Application status`.

# Step 3 : 
- Now open DashboardShell.tsx

- Remove `const [activeItem, setActiveItem] = useState("jobs")` completely.

# Step 4
- import { usePathname } from "next/navigation"
- Inside the component add
    > const pathname = usePathname()

# Step 5 : Update the naviation items

> Currently:

type NavItem = {
  id: string
  label: string
  icon: typeof LayoutGrid
}

> Change it to:

type NavItem = {
  label: string
  href: string
  icon: typeof LayoutGrid
}

- Now replace const navItems,
> from:
const navItems: NavItem[] = [
  { id: "jobs", label: "Jobs", icon: LayoutGrid },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "profile", label: "Profile", icon: UserCircle },
  { id: "status", label: "Application Status", icon: CircleCheckBig },
]

> To:
const navItems = [
  {
    label: "Jobs",
    href: "/dashboard/jobs",
    icon: LayoutGrid,
  },
  {
    label: "Resume",
    href: "/dashboard/resume",
    icon: FileText,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: UserCircle,
  },
  {
    label: "Application Status",
    href: "/dashboard/status",
    icon: CircleCheckBig,
  },
]

# Step 6
---
- Replace <button
with
<Link

> From:

<button
    key={item.id}
    type="button"
    onClick={() => setActiveItem(item.id)}
    className={cn(
    "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition-all",
    isActive
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:bg-accent hover:text-foreground"
    )}
>
    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background/70">
    <Icon className="size-4" />
    </div>
    {!collapsed && <span>{item.label}</span>}
</button>

> To:

<Link
    key={item.href}
    href={item.href}
    className={cn(
    "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition-all",
    pathname === item.href
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:bg-accent hover:text-foreground"
    )}
>

</Link>

- Replace `const isActive = activeItem === item.id` with `const isActive = pathname === item.href`



__NOTE__

How this works!

The `app/dashboard` is the directory for the `page.tsx` and `layout.tsx` files.
The `layout.tsx` has the:
    > logic for the dashboard - user logic & onboarding logic
    > The `DashboardShell` component with the following props passed along : 
        - displayName={displayName}
        - initials={initials}
        - avatarUrl={avatarUrl}
        - userEmail={user.email ?? ""}
        - needsOnboarding={needsOnboarding}
        - >> {children}

The `page.tsx` simply `redirects` to the `child` page, Where it be the `dashboard/jobs`, `dashboard/...`


The same logic applies when you create a new NextJS application.
Notice there is a `layout.tsx` file that has `{children}` in the `return statement`, as well as a `page.tsx`.
The `page.tsx` contains the welcome webpage that you see that we always destroy and make our entry point to our website.

The directories in `app/` such as `sign-in`, `sign-up` are used in the <Link/> tags has `href=""/sign-in`. In these children folders, there are also `page.tsx`.
This is the way Next.js does things!!!

__END NOTE__

## Dashboard Architecture for Menu Items :: COMPLETE ##
## COMMIT 2 - DONE ##
<<<<<<< HEAD
=======


## Commit 3
---

We are going to build:
- Resume View
- Profile View

Create this folder:

components
└── dashboard
    └── views
        ├── jobs-view.tsx
        ├── resume-view.tsx
        ├── profile-view.tsx
        └── application-status-view.tsx

- rafce

# Step A

Move the UI out of the App Router pages.

For example,
app/dashboard/jobs/page.tsx

becomes

import { JobsView } from "@/components/dashboard/views/jobs-view";

export default function JobsPage() {
  return <JobsView />;
}

- and so on for all the other dashboard pages/views.

Essentially we want this architecture:

components/
└── dashboard/
    ├── dashboard-shell.tsx
    ├── onboarding/
    │   └── resume-onboarding-dialog.tsx
    ├── resume/
    │   ├── uploaded-resume-card.tsx
    │   ├── resume-parsing-card.tsx
    │   └── resume-insights-card.tsx
    ├── profile/
    │   ├── personal-information-card.tsx
    │   ├── professional-summary-card.tsx
    │   ├── skills-card.tsx
    │   ├── experience-card.tsx
    │   ├── education-card.tsx
    │   ├── projects-card.tsx
    │   ├── certifications-card.tsx
    │   └── links-card.tsx
    └── views/
        ├── jobs-view.tsx
        ├── resume-view.tsx
        ├── profile-view.tsx
        └── application-status-view.tsx

We will be using ShadCN Cards for components being displayed on the dashboard pages.
These cards will simply be fed information from Supabase.

# Step 1 - Create the folders

Inside components/dashboard create:

dashboard/
│
├── onboarding/
│   └── resume-onboarding-dialog.tsx
│
├── resume/
│   ├── uploaded-resume-card.tsx
│   ├── resume-parsing-card.tsx
│   └── resume-insights-card.tsx
│
├── profile/
│   ├── personal-information-card.tsx
│   ├── professional-summary-card.tsx
│   ├── skills-card.tsx
│   ├── experience-card.tsx
│   ├── education-card.tsx
│   ├── projects-card.tsx
│   ├── certifications-card.tsx
│   └── links-card.tsx
│
└── views/
    ├── jobs-view.tsx
    ├── resume-view.tsx
    ├── profile-view.tsx
    └── application-status-view.tsx

- Change `resume-view.tsx` file to include these new card components.
> So from:

import React from 'react'

const ResumeView = () => {
  return (
    <div>ResumeView</div>
  )
}

export default ResumeView

> To:

import { UploadedResumeCard } from "../resume/uploaded-resume-card";
import { ResumeParsingCard } from "../resume/resume-parsing-card";
import { ResumeInsightsCard } from "../resume/resume-insights-card";

export function ResumeView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Resume
        </h1>

        <p className="text-muted-foreground mt-1">
          Manage your uploaded resume and AI parsing.
        </p>
      </div>

      <UploadedResumeCard />

      <div className="grid gap-6 lg:grid-cols-2">
        <ResumeParsingCard />

        <ResumeInsightsCard />
      </div>
    </div>
  );
}

# Step 2 : Build first `real` card

- Create the `upload-resume-card.tsx`.
- This is because it will map to what we have in our database already.
- Create static content for now, but later we will read from the database.

- Once it is created, add it to the `ResumeView` as a component.

> Next, we'll create the `ResumeParsingCard`.

Initially it will show static information:

Resume Parsing

Status
Completed

Last Parsed
Today

AI Model
Gemini 2.5 Flash

Processing
Ready

Later we'll replace those values with:

Status
Uploading...

↓

Parsing...

↓

Saving...

↓

Completed

without changing the UI.

- The card layout will look something like:

┌──────────────────────────────┐
│ Resume Parsing               │
├──────────────────────────────┤
│                              │
│ Status                       │
│ ✔ Completed                  │
│                              │
│ Last Parsed                  │
│ Today                        │
│                              │
│ AI Model                     │
│ Gemini 2.5 Flash             │
│                              │
│ Processing                   │
│ Ready                        │
└──────────────────────────────┘

- After this, we will create the `ResumeInsightsCard`.

Then we'll build the Resume Insights Card

This card is even more exciting because it previews what Gemini extracted.

> Initially: Static Information

Resume Insights

Skills
0

Experience
0

Education
0

Projects
0

Certifications
0

> After Gemini runs:

Resume Insights

Skills
18

Experience
4

Education
2

Projects
5

Certifications
3

Users immediately see that the AI has parsed their resume successfully.

------

Here's the roadmap:

> ✅ Commit 3
✔ UploadedResumeCard (DONE)
🔄 ResumeParsingCard 
🔄 ResumeInsightsCard
🔄 Connect Resume page to Supabase

> Commit 4
Build the Profile page cards:

Personal Information
Professional Summary
Skills
Experience
Education
Projects
Certifications
Links

> Commit 5
Integrate Gemini SDK.

> Commit 6
Add Inngest background jobs.

> Commit 7
Automatically populate the Profile page after parsing.

[I will not be commenting as much from now on, we are already at 729 lines of the 2nd README.md file.]
[I will however make note of important things.]

__Moving along__
.
.
.
.

- `ResumeParsingCard` && `ResumeInsightsCard` :: DONE!

# Connecting Supabase...
- To do this we'll transform the `ResumePage` into a server component that loads the resume.

So from:

import {ResumeView} from "@/components/dashboard/views/resume-view";

export default function ResumePage() {
  return <ResumeView />
}

- We'll have the final product.
- Pass this the DB information as a prop to the `ResumeView` : <ResumeView resume={resume} />
- Pass the resume information as a prop to the `UploadedResumeCard` : <UploadedResumeCard resume={resume} />

Let's make showing the `Size` `beautiful`. `Create` a `function` called `formatFileSize` in a file in `lib/` called `format-file-size.ts`.
- `Import` it in `UploadedResumeCard`.
- Use it to display the File size nicely.


- Now, the `VIEW` button should actually `open` the `Resume`.

> Replace:

<Button variant="outline">
    <Eye className="mr-2 h-4 w-4"/>
    View
</Button>

> With:

<Button  variant="outline" asChild>
  <a
      href={resume.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center"
  >
    <Eye className="mr-2 h-4 w-4"/>
    View
  </a>
</Button>

---
# Upload to GitHub
---

## AI Preparation
---
>>>>>>> ee6c453 (Resume Page displayes DB Information)


## Commit 3
---

We are going to build:
- Resume View
- Profile View

Create this folder:

components
└── dashboard
    └── views
        ├── jobs-view.tsx
        ├── resume-view.tsx
        ├── profile-view.tsx
        └── application-status-view.tsx

- rafce

# Step A

Move the UI out of the App Router pages.

For example,
app/dashboard/jobs/page.tsx

becomes

import { JobsView } from "@/components/dashboard/views/jobs-view";

export default function JobsPage() {
  return <JobsView />;
}

- and so on for all the other dashboard pages/views.

Essentially we want this architecture:

components/
└── dashboard/
    ├── dashboard-shell.tsx
    ├── onboarding/
    │   └── resume-onboarding-dialog.tsx
    ├── resume/
    │   ├── uploaded-resume-card.tsx
    │   ├── resume-parsing-card.tsx
    │   └── resume-insights-card.tsx
    ├── profile/
    │   ├── personal-information-card.tsx
    │   ├── professional-summary-card.tsx
    │   ├── skills-card.tsx
    │   ├── experience-card.tsx
    │   ├── education-card.tsx
    │   ├── projects-card.tsx
    │   ├── certifications-card.tsx
    │   └── links-card.tsx
    └── views/
        ├── jobs-view.tsx
        ├── resume-view.tsx
        ├── profile-view.tsx
        └── application-status-view.tsx

We will be using ShadCN Cards for components being displayed on the dashboard pages.
These cards will simply be fed information from Supabase.

# Step 1 - Create the folders

Inside components/dashboard create:

dashboard/
│
├── onboarding/
│   └── resume-onboarding-dialog.tsx
│
├── resume/
│   ├── uploaded-resume-card.tsx
│   ├── resume-parsing-card.tsx
│   └── resume-insights-card.tsx
│
├── profile/
│   ├── personal-information-card.tsx
│   ├── professional-summary-card.tsx
│   ├── skills-card.tsx
│   ├── experience-card.tsx
│   ├── education-card.tsx
│   ├── projects-card.tsx
│   ├── certifications-card.tsx
│   └── links-card.tsx
│
└── views/
    ├── jobs-view.tsx
    ├── resume-view.tsx
    ├── profile-view.tsx
    └── application-status-view.tsx

- Change `resume-view.tsx` file to include these new card components.
> So from:

import React from 'react'

const ResumeView = () => {
  return (
    <div>ResumeView</div>
  )
}

export default ResumeView

> To:

import { UploadedResumeCard } from "../resume/uploaded-resume-card";
import { ResumeParsingCard } from "../resume/resume-parsing-card";
import { ResumeInsightsCard } from "../resume/resume-insights-card";

export function ResumeView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Resume
        </h1>

        <p className="text-muted-foreground mt-1">
          Manage your uploaded resume and AI parsing.
        </p>
      </div>

      <UploadedResumeCard />

      <div className="grid gap-6 lg:grid-cols-2">
        <ResumeParsingCard />

        <ResumeInsightsCard />
      </div>
    </div>
  );
}

# Step 2 : Build first `real` card

- Create the `upload-resume-card.tsx`.
- This is because it will map to what we have in our database already.
- Create static content for now, but later we will read from the database.

- Once it is created, add it to the `ResumeView` as a component.

> Next, we'll create the `ResumeParsingCard`.

Initially it will show static information:

Resume Parsing

Status
Completed

Last Parsed
Today

AI Model
Gemini 2.5 Flash

Processing
Ready

Later we'll replace those values with:

Status
Uploading...

↓

Parsing...

↓

Saving...

↓

Completed

without changing the UI.

- The card layout will look something like:

┌──────────────────────────────┐
│ Resume Parsing               │
├──────────────────────────────┤
│                              │
│ Status                       │
│ ✔ Completed                  │
│                              │
│ Last Parsed                  │
│ Today                        │
│                              │
│ AI Model                     │
│ Gemini 2.5 Flash             │
│                              │
│ Processing                   │
│ Ready                        │
└──────────────────────────────┘

- After this, we will create the `ResumeInsightsCard`.

Then we'll build the Resume Insights Card

This card is even more exciting because it previews what Gemini extracted.

> Initially: Static Information

Resume Insights

Skills
0

Experience
0

Education
0

Projects
0

Certifications
0

> After Gemini runs:

Resume Insights

Skills
18

Experience
4

Education
2

Projects
5

Certifications
3

Users immediately see that the AI has parsed their resume successfully.

------

Here's the roadmap:

> ✅ Commit 3
✔ UploadedResumeCard (DONE)
🔄 ResumeParsingCard 
🔄 ResumeInsightsCard
🔄 Connect Resume page to Supabase

> Commit 4
Build the Profile page cards:

Personal Information
Professional Summary
Skills
Experience
Education
Projects
Certifications
Links

> Commit 5
Integrate Gemini SDK.

> Commit 6
Add Inngest background jobs.

> Commit 7
Automatically populate the Profile page after parsing.

[I will not be commenting as much from now on, we are already at 729 lines of the 2nd README.md file.]
[I will however make note of important things.]

__Moving along__
.
.
.
.

- `ResumeParsingCard` && `ResumeInsightsCard` :: DONE!

# Connecting Supabase...
- To do this we'll transform the `ResumePage` into a server component that loads the resume.

So from:

import {ResumeView} from "@/components/dashboard/views/resume-view";

export default function ResumePage() {
  return <ResumeView />
}

- We'll have the final product.
- Pass this the DB information as a prop to the `ResumeView` : <ResumeView resume={resume} />
- Pass the resume information as a prop to the `UploadedResumeCard` : <UploadedResumeCard resume={resume} />

Let's make showing the `Size` `beautiful`. `Create` a `function` called `formatFileSize` in a file in `lib/` called `format-file-size.ts`.
- `Import` it in `UploadedResumeCard`.
- Use it to display the File size nicely.


- Now, the `VIEW` button should actually `open` the `Resume`.

> Replace:

<Button variant="outline">
    <Eye className="mr-2 h-4 w-4"/>
    View
</Button>

> With:

<Button  variant="outline" asChild>
  <a
      href={resume.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center"
  >
    <Eye className="mr-2 h-4 w-4"/>
    View
  </a>
</Button>

---
# Upload to GitHub
---

## AI Preparation
---

- Let's build the `Profile Page`
- Because, if resume is parsed to Gemini, there is no UI to display the information.

-------------------------------------------------
🚀 `Commit 4`

Build the Profile page.

This is where Gemini will eventually write all the extracted data.

We'll create these cards:

Profile

┌────────────────────────────────────────────┐
│ Personal Information                       │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Professional Summary                       │
└────────────────────────────────────────────┘

┌──────────────────┐ ┌───────────────────────┐
│ Skills           │ │ Education             │
└──────────────────┘ └───────────────────────┘

┌────────────────────────────────────────────┐
│ Work Experience                            │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Projects                                   │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Certifications                             │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Links                                      │
└────────────────────────────────────────────┘

Notice something important...

We're building exactly the UI that Gemini will fill later.

`Commit 5`

Database expansion.

Right now you only have:

profiles
resumes

We'll add proper tables for:

skills
work_experience
education
projects
certifications
links

Every one linked to the user.

`Commit 6`

Install Gemini SDK.

Create:

lib/ai/

    gemini.ts

    prompts.ts

    parser.ts

`Commit 7`

Install Inngest.

We'll create a background workflow like this:

Resume Uploaded

↓

Upload to Storage

↓

Create Resume Record

↓

Trigger Inngest Event

↓

Gemini Reads Resume

↓

Extract Data

↓

Save Profile

↓

Save Skills

↓

Save Experience

↓

Save Education

↓

Save Projects

↓

Save Certifications

↓

Mark Resume Parsed

↓

Dashboard Updates Automatically

This is the workflow we envisioned from the beginning.
-----------------------------------------------------------



# Commit 3.4 - Replace Resume
---

- We're not creating another resume record.
- The resumes table has:
  > user_id UNIQUE
  > which means one user = one resume

- Create the following files: in `app/dashboard/actions`:
  > replace-resume-action.ts
  > delete-resume-action.ts (`# COMMIT 3.5`)

  These will be `server actions`.

----
__Good Architecture__
This is why we designed the onboarding the way we did!

If there is no row in resumes:

`const needsOnboarding = !resume`

becomes

`true`

and the onboarding automatically comes back.

No extra logic.

That's good architecture.
__END__
-----

Turn `UploadedResumeCard` into a `Client Component`

Because we'll need:

`useRef`
`useActionState`
a hidden file input
automatic form submission

add this at the top:

"use client"
Step 2 — Imports

Add these imports:

import { useActionState, useEffect, useRef } from "react"

import { replaceResumeAction } from "@/app/actions/replace-resume-action"
Step 3 — Create the form state

Inside the component:

const formRef = useRef<HTMLFormElement>(null)

const inputRef = useRef<HTMLInputElement>(null)

const [state, formAction] = useActionState(
  replaceResumeAction,
  {}
)
Step 4 — Automatically submit after selecting a file

Add this function:

function handleFileChange() {
  formRef.current?.requestSubmit()
}

This is one of my favorite UX improvements.

Instead of:

Replace

↓

Choose file

↓

Click Upload

↓

Wait

the user experiences:

Replace

↓

Choose file

↓

Done

Much smoother.

Step 5 — Wrap the Replace button inside a form

Replace your current Replace button with:

<form
  ref={formRef}
  action={formAction}
>
  <input
    ref={inputRef}
    hidden
    type="file"
    name="resume"
    accept=".pdf,.docx"
    onChange={handleFileChange}
  />

  <Button
    type="button"
    variant="outline"
    onClick={() => inputRef.current?.click()}
  >
    <Replace className="mr-2 h-4 w-4" />

    Replace
  </Button>
</form>

That's it.

Step 6 — Refresh after success

Since replaceResumeAction() already calls:

revalidatePath("/dashboard/resume")

the data is refreshed on the server.

To immediately update the page without a manual refresh, add:

import { useRouter } from "next/navigation"

Then:

const router = useRouter()

And:

useEffect(() => {
  if (state.success) {
    router.refresh()
  }
}, [state.success, router])

Now the sequence is:

Click Replace

↓

Choose File

↓

Upload

↓

Database Updated

↓

Storage Updated

↓

router.refresh()

↓

New Resume Appears

No page reload.

No redirect.


# Commit 3.5 - Deleting Resume
---
- Not, we already wrote the logic for `if a logged in user does not have a resume in DB display the onboardingModal.`

- Create a server action in `@app/dashboard/actions` called `delete-resume-action.ts`.
- The actual function will be called `deleteResumeAction`.

- Write the logic in this server action.

- But let's `create` a `confirmation dialog` `to` the `upload-resume-card.tsx`.

[
  Note : Bug
  ----------
  After deletion, the onboarding modal would appear which is expected!
  But after selecting and submitting a document, the database and dashboard/resume page would be populated with data,
  but the delete dialog would still be open.

  The old code:
  ---
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Resume
        </h1>

        <p className="text-muted-foreground mt-1">
          Manage your uploaded resume and AI parsing.
        </p>
      </div>

      {/* We need to pass the resume information to the UploadedResumeCard component as well to display DB information */}
      <UploadedResumeCard resume={resume} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ResumeParsingCard />

        <ResumeInsightsCard />
      </div>
    </div>
  );

  The fix (in resume-view.tsx file):
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Resume
        </h1>

        <p className="text-muted-foreground mt-1">
          Manage your uploaded resume and AI parsing.
        </p>
      </div>

      {/* We need to pass the resume information to the UploadedResumeCard component as well to display DB information */}
      {resume ? (
        <>
          <UploadedResumeCard resume={resume} />

          <div className="grid gap-6 lg:grid-cols-2">
            <ResumeParsingCard />

            <ResumeInsightsCard />
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          No resume uploaded yet.
        </div>
      )}
    </div>
  );

  I think this `traps` the <UploadedResumeCard /> from `displaying`, which has the Delete Dialog in it!
  So if the `UploadedResumeCard` component does not display, implicitly the `Delete Dialog does not show`.


  The correct terminology is `React doesn't just hide/trap the component. It unmounts it.`
  Meaning:
  ✅ AlertDialog is destroyed.
  ✅ Delete state disappears.
  ✅ useEffects are cleaned up.
  ✅ useActionState is reset.
  ✅ Any internal component state is gone.
]

## Commit 4
---

# Profile Page
---
- 