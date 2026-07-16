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

