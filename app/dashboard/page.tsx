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

  // Sin Cara & ChatGPT
  const { data: resume } = await supabase
  .from("resumes")
  .select("id")
  .eq("user_id", user.id)
  .maybeSingle()

  const needsOnboarding = !resume
  //---------------------

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
    <DashboardShell
      displayName={displayName}
      initials={initials}
      avatarUrl={avatarUrl}
      userEmail={user.email ?? "your account"}
      needsOnboarding={needsOnboarding}
    />
    
    // <DashboardUploadTestShell />
    // <DashboardFileUploadTestShell />
  )
}
