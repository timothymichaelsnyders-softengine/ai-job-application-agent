"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  CircleCheckBig,
  CreditCard,
  FileText,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles,
  UserCircle,
} from "lucide-react"
import { ResumeOnboardingDialog } from "@/components/dashboard/resume-onboarding-dialog"

type DashboardShellProps = {
  displayName: string
  initials: string
  avatarUrl?: string | null
  userEmail: string
  needsOnboarding: boolean
}

type NavItem = {
  id: string
  label: string
  icon: typeof LayoutGrid
}

const navItems: NavItem[] = [
  { id: "jobs", label: "Jobs", icon: LayoutGrid },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "profile", label: "Profile", icon: UserCircle },
  { id: "status", label: "Application Status", icon: CircleCheckBig },
]

export function DashboardShell({
  displayName,
  initials,
  avatarUrl,
  userEmail,
  needsOnboarding,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("jobs")

  return (
    <>
      {needsOnboarding && (
          <ResumeOnboardingDialog open={needsOnboarding} />
      )}

      <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_30%),linear-gradient(135deg,_rgba(255,255,255,0.95),_rgba(241,245,249,0.95))]">
        <aside
          className={cn(
            "flex h-screen flex-col border-r border-border/70 bg-background/85 backdrop-blur-xl transition-all duration-300",
            collapsed ? "w-24" : "w-72"
          )}
        >
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-4">
            <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="size-5" />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold tracking-tight">
                    JobBuddy AI
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Career workspace
                  </p>
                </div>
              )}
            </Link>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed((prev) => !prev)}
              className="shrink-0 rounded-full"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </Button>
          </div>

          <nav className="flex-1 space-y-2 px-3 py-5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.id

              return (
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
              )
            })}
          </nav>

          <div className="border-t border-border/70 p-3">
            <div className="rounded-2xl border border-border/70 bg-muted/40 p-3">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CreditCard className="size-4" />
                </div>
                {!collapsed && (
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">Billing / Credits</p>
                    <p className="text-xs text-muted-foreground">
                      1,240 credits available
                    </p>
                  </div>
                )}
              </div>

              {!collapsed && (
                <div className="rounded-xl border border-border/70 bg-background/80 p-3 shadow-sm">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Credits</span>
                    <span className="font-semibold">1,240</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-muted">
                    <div className="h-2 w-3/4 rounded-full bg-primary" />
                  </div>
                </div>
              )}

              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "mt-3 w-full justify-start gap-2 rounded-xl px-3 py-2",
                  collapsed && "justify-center px-0"
                )}
              >
                <Settings className="size-4" />
                {!collapsed && <span>Profile Settings</span>}
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-border/70 bg-background/70 px-6 py-4 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold tracking-tight">Dashboard</p>
                <p className="text-sm text-muted-foreground">
                  {displayName} • {userEmail}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="size-9 border border-border/70">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <div className="flex-1 p-6">
            <div className="flex h-full min-h-[560px] flex-col rounded-[28px] border border-border/70 bg-background/80 p-6 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.35)]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {navItems.find((item) => item.id === activeItem)?.label || "Workspace"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    This section is ready for future content.
                  </p>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-center rounded-[24px] border border-dashed border-border/70 bg-muted/25 p-8">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="size-6" />
                  </div>
                  <p className="text-lg font-semibold">A fresh workspace is waiting</p>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Build your experience here once the page-specific content is ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
