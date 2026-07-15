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

--------

# Resume Upload and Parse
---

We want users to upload the resume and set up the profile information.
If user is `new user` then we will `present` them with a `dialog` to `upload` the resume. The `dashboard` will be `blocked` until they upload the resume document.

The user will `upload` the `resume` and our system will `extract` the `data` and `save` it back into our `database`.

`We` also `want` to `save` the uploaded `resume` into our Supabase `Storage`.

`Only` once all this is done, we will `UNLOCK` dashboard (grant access).

We want the user `information` to `autopopulate` the `form` and the information should be `editable`.


---
Prompt AI with the following:
---

"
Now let’s implement an onboarding dialog that appears when a new user has not uploaded a resume or added profile information.

When a new user logs in for the first time, show a non-closable dialog. This dialog should ask the user to upload their resume before they can continue using the dashboard.

Once the user uploads a resume:

1. Upload and save the resume file to Supabase Storage.
2. Parse the uploaded resume.
3. Extract all important details from the resume and save them properly in the database.

The extracted resume data should include:

* User profile information
* Professional summary
* Skills
* Work experience

  * Company name
  * Job title
  * Duration
  * Responsibilities / bullet points
* Education information
* Projects, certifications, links, and any other important resume details

After parsing the resume, automatically populate the Profile section form with the extracted information.

In the Profile section, display all parsed data in a clean and editable form. Users should be able to manually update or modify any information after it is auto-filled from the resume.

Also, once the resume is uploaded, show the uploaded resume under the Resume page in a proper list format.

Make sure the complete flow is smooth, user-friendly, and properly connected with Supabase database and storage.

Use google Gemini AI model with Gemini AI sdk for AI model
"

# __BUT BEFORE__
__Let's Develop The Upload Logic__

- Let's add the `GEMINI_API_KEY` & `GEMINI_MODEL` to our `ENVIRONMENT VARIABLES`
- Let's install mammoth and pdf-parse

> Now let's create the logic...

_Create a dummy component_
- Create a dummy component called `DashboardUploadTestShell.tsx`.
- Replace this new component with the `DashboardShell.tsx` for now.
- This new component will just allow us to select file(s) and upload them.
    > Code this

_Image Demo_
- For the sake of `Demo`, we will upload Images.
- In the `lib/utils.ts` file, create a function `convertBlobUrlToFile`:

export async function convertBlobUrlToFile(blobUrl: string) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const fileName = Math.random().toString(36).slice(2, 9);
  const mimeType = blob.type || "application/octet-stream";
  const file = new File([blob], `${fileName}.${mimeType.split("/")[1]}`,
  {
    type: mimeType,
  });
  return file;
}

_Supabase Class (generated by AI prompt)_
- The `createSupabaseClient()` funciton is in `lib/supabase`.
- This is the file we need.

_uploadImage Function_
- In the `lib/supabase` directory, create a new directory and file: `storage/client.ts`.

- install:
    > uuidv4 : npm install -D @types/uuid 
    > imageCompression : npm i browser-image-compression


_Translate Image Upload Code to File Upload Code_

> dashboard-file-upload-shell.tsx
---

"use client";

import { uploadFile } from "@/lib/supabase/storage/client.copy";
import { convertBlobUrlToFile } from "@/lib/utils";
import Image from "next/image";
import { ChangeEvent, useRef, useState, useTransition } from "react";

const DashboardFileUploadTestShell = () => {

  const [files, setFiles] = useState<File[]>([]);
  
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Expects an event of type ChangeEvent<HTMLInputElement>
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        setFiles(Array.from(e.target.files));
  };

  const [isPending, startTransition] = useTransition();

  const handleClickUploadImagesButton = () => {
    startTransition(async () => {
        for(const file of files) {
            await uploadFile({
                file,
                bucket: "resumes",
            });
        }

        // console.log(urls);
        setFiles([]);
    })
  }

  return (
    <div className='bg-slate-500 min-h-screen flex justify-center items-center flex-col gap-8'>

        <input 
            type='file' 
            accept=".pdf,.docx"
            hidden 
            multiple 
            ref={imageInputRef} 
            onChange={handleFileChange}
            disabled={isPending}    
        />
        <button 
            className='bg-slate-600 py-2 w-49 rounded-lg' 
            onClick={() => {
                imageInputRef.current?.click()
            }}
            disabled={isPending}
        >
            Select Files
        </button>    

        <div className="flex-row gap-4">
            {files.map((file, index) => (
                <p key={index}>
                    {index + 1}. {file.name}
                </p>
            ))}
        </div>    

        <button 
            className='bg-slate-600 py-2 w-49 rounded-lg'
            onClick={handleClickUploadImagesButton}
        >
            {isPending ? "Uploading..." : "Upload Images"}
        </button>

    </div>
  )
}

export default DashboardFileUploadTestShell


> lib/supabase/client.copy.ts
---

import { v4 as uuidv4 } from 'uuid';
import { createClient } from '../client';

function getStorage() {
    const { storage } = createClient(); // this is the class that we need from `lib/supabase`
    return storage;
}

type UploadProps = {
    file: File;
    bucket: string;
    folder?: string;
}

export async function uploadFile({ file, bucket, folder }: UploadProps) {
    const fileName = file.name;
    const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1); // get everything to the right of the last `.`
    
    // generate a uuid for this path to make it unique
    // `npm i uuid`
    // If you're using Typescript: pnpm add -D @types/uuid
    const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`

    const storage = getStorage();

    // VALIDATE RESUMES:
    const allowed = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.type)) {
        return {
            error: "Only PDF and DOCX files are allowed."
        };
    }

    const { data, error } = await storage.from(bucket).upload(path, file);

    if( error ) {
        return {fileUrl: "", error: "Image upload failed"};
    }

    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${data?.path}`;

    return { fileUrl, path, error: "" };
}


> app/dashboard/page.tsx
---

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import DashboardUploadTestShell from "@/components/dashboard/dashboard-upload-test-shell"
import DashboardFileUploadTestShell from "@/components/dashboard/dashboard-file-upload-shell"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User"

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const avatarUrl =
    profile?.avatar_url ||
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture

  return (
    // <DashboardShell
    //   displayName={displayName}
    //   initials={initials}
    //   avatarUrl={avatarUrl}
    //   userEmail={user.email ?? "your account"}
    // />
    // <DashboardUploadTestShell />
    <DashboardFileUploadTestShell />
  )
}


# File upload Complete!

## Building the Onboarding Modal
---

First, create a boolean in page.tsx.

After fetching the profile, also check whether the user has uploaded a resume.

Something like:

const { data: resume } = await supabase
  .from("resumes")
  .select("id")
  .eq("user_id", user.id)
  .maybeSingle()

const needsOnboarding = !resume

Later we'll make this slightly smarter by also checking profile completeness, but for now:

No resume
=
Show onboarding
Step 2

Pass it to the dashboard.

<DashboardShell
    displayName={displayName}
    initials={initials}
    avatarUrl={avatarUrl}
    userEmail={user.email ?? "your account"}
    needsOnboarding={needsOnboarding}
/>
Step 3

Extend the props.

type DashboardShellProps = {
    displayName: string
    initials: string
    avatarUrl?: string | null
    userEmail: string
    needsOnboarding: boolean
}
Step 4

Create a dedicated component.

components/dashboard/resume-onboarding-dialog.tsx

Not inside DashboardShell.

A separate component.

Later this component will become quite large because it will contain

drag & drop
upload progress
parsing state
AI state
errors
success animation

Keeping it separate will save you a lot of headaches.

Step 5

Render it.

Inside DashboardShell

<>
    {needsOnboarding && (
        <ResumeOnboardingDialog />
    )}

    ...
</>
Step 6

For now, the dialog can literally just be

+-------------------------------------------+

Welcome to JobBuddy AI

Upload your resume to continue.

[ Select Resume ]

PDF • DOCX

+-------------------------------------------+

Notice there is

❌ no close button

No X

No Cancel

No Escape

No clicking outside

The user must upload.


- Create the Resume Table in Supabase:
---

create table public.resumes (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    file_name text not null,
    file_path text not null,
    file_url text,

    file_size bigint,
    file_type text,

    status text not null default 'processing'
        check (status in ('processing', 'completed', 'failed')),

    uploaded_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    unique(user_id)
);
Why unique(user_id)?

For your application, each user will have one active resume.

Later, if you decide to support multiple resumes, simply remove this constraint and you'll be able to store many resumes per user.

Automatically update updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_resumes_updated_at
before update on public.resumes
for each row
execute function public.update_updated_at_column();
Enable Row Level Security
alter table public.resumes
enable row level security;
Policy: Users can only access their own resume
create policy "Users can view their own resume"
on public.resumes
for select
using (auth.uid() = user_id);

create policy "Users can insert their own resume"
on public.resumes
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own resume"
on public.resumes
for update
using (auth.uid() = user_id);

create policy "Users can delete their own resume"
on public.resumes
for delete
using (auth.uid() = user_id);
Then your dashboard check becomes very simple:
const { data: resume } = await supabase
  .from("resumes")
  .select("id")
  .eq("user_id", user.id)
  .maybeSingle()

const needsOnboarding = !resume


- >> Create the `ResumeOnboardingDialog` component

-- >> Everything is working! The Onboarding Process is 100%!

__Note:__
In Supabase Storage, how it is saved:
1. Storage (the actual file)
---
resumes
└── user-id
    └── randomUUID.pdf

- We also make the `upload` a `server action` instead of doing it from the `client`.
    > To do this, we created `app/dashboard/actions/upload-resume.ts`


>> CONTIUE ON `README2.md`