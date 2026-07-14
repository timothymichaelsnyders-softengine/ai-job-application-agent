## Begin
---

__ShadCN UI__
- Initialize ShadCN UI
    > npx shadcn@latest init

- Add the components:
    > npx shadcn@latest add
    > Select `All`

__Cursor__
- Download and Install `Cursor` (Windows, MacOS)
- `Sign In` to Cursor
- `Open` this `project` directory in `Cursor` (Click on `Editor Window`)

__Code Rabbit__
- Log in
- Select Project From list of GitHub Repos

__Supabase Setup__
- Sign In
- `Create` a new `Project`
- Name : "AI Job Agent"
- Add a strong `password`
- Leave the rest as is, click `Create new project`

- In Cursor, go to `Cursor Settings` > `Plugins` > Search `Supabase` > `Add to Cursor` > `Add to Project`
- Go to `Tools & MCP` > `Scroll down` to Supabase > Click `Connect`

- In the AI prompt, change from `Ask` to `Agent`
- Add the prompt:

"/supabase Now let's set up Supabase for the database, email/password authentication, and Google authentication.

Use the Supabase MCP tools and available skills to configure Supabase properly.

Design a clean and modern UI/UX for the Sign In and Sign Up pages.

After a successful login, users should be allowed to navigate to the dashboard. If the user is not logged in, they should not be able to access the dashboard.

Protect the dashboard route using a middleware file."

- After the generated output, there are some manual steps we have to do for Supabase, noted by `Google OAuth — manual setup required`

> - Go to Google Cloud Console
> - Clients > Create Client
> - Authentication Type : `Web application`
> - Authorized JavaScript origins : `http://localhost:3000`
> - Authorized redirect URIs : Copy the `Authorized redirect URI:` created by Cursor and Paste it.
> - We also need to add the `http://localhost:3000/auth/callback` under `Authorized redirect URIs`.

> - `Copy` the `Client ID` (Provided in Google Cloud Console) and paste it in Supabase's `Client IDs` for `Google`.
> - `Copy` the `Client secrect` (provided by Google Cloud Console) and paste it in Supabase's `Client Secret (for OAuth)`

[Make sure that `Google` is `Enabled`] 

>> Run application.

[
    Note!!!
    The callback `http://localhost:3000/auth/callback` does not need to be added to Google Cloud Console.
    It does however need to be `added` to `Supabase`

    - Go to Supabase Dashboard > Authentication > URL Configuration > Redirect URL > Add it here.
    - `Save URL`
]

- >> Once we deploy the application, we need to add it to URL Configuration as well

>> Sign In With `Google`.
>> Perfect! Redirected to the Dashboard.
>> To confirm it is working, Go to Supabase `Table Editor`. There should be a new table called `profiles`.
    > This should contain the details of the user you just logged in with :)

Moving along...


# Dashboard Layout
---

- In Cursor, `create` a `new agent`
- `Close` the `old` one
- Paste the prompt: 

"Create a dashboard layout with a collapsible sidebar.

The sidebar should support an icon-only collapsed state and a full expanded state. At the top of the sidebar, show the logo and app name: **JobBuddy AI**.

Add the following sidebar navigation options:

* Jobs
* Resume
* Profile
* Application Status

At the bottom of the sidebar, add a footer section that includes:

* Billing / Credits
* A proper credits display section
* Profile Settings option

For now, keep all pages blank because we will implement the actual page content later.

Make sure the dashboard layout looks clean, modern, and professional with good UI/UX."

- Just for kicks, have AI set the Application Theme color:

"Update ShadCN/ application primary color to : #ACF417"
or
"Update ShadCN/ application primary color to : #ACF417 and also increase sidebar option icons size and name bigger and make sure it looks little bit bigger so empty space will not be too visible"

- Edits `globals.css`
- If you prompt "Use this theme on the dashboard", it edits `dashboard-shell.tsx`

- Make sure that each of the Sidebar menu items, when they are clicked on, the URL has their names in the path, eg `http://localhost:3000/dashboard/jobs`

# Push to GitHub and Check changes from Pull Request(s)