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
    const supabase = await createClient()

    // get the user
    const {
        data: { user },
    } = await supabase.auth.getUser()

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