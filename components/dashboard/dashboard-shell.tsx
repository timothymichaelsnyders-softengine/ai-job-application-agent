"use client"

import { useState, ReactNode } from "react"
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
import { ResumeOnboardingDialog } from "@/components/dashboard/onboarding/resume-onboarding-dialog"
import { usePathname } from "next/navigation"

type DashboardShellProps = {
  children : ReactNode
  displayName: string
  initials: string
  avatarUrl?: string | null
  userEmail: string
  needsOnboarding: boolean
}

type NavItem = {
  id: string
  href: string
  icon: typeof LayoutGrid
}

const navItems : NavItem[] = [
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

export function DashboardShell({
  children,
  displayName,
  initials,
  avatarUrl,
  userEmail,
  needsOnboarding,
}: DashboardShellProps) {

  const pathname = usePathname()

  const [collapsed, setCollapsed] = useState(false)

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
              // const isActive = activeItem === item.id
              const isActive = pathname === item.href

              return (
                // <button
                //   key={item.id}
                //   type="button"
                //   onClick={() => setActiveItem(item.id)}
                //   className={cn(
                //     "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition-all",
                //     isActive
                //       ? "bg-primary text-primary-foreground shadow-sm"
                //       : "text-muted-foreground hover:bg-accent hover:text-foreground"
                //   )}
                // >
                //   <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background/70">
                //     <Icon className="size-4" />
                //   </div>
                //   {!collapsed && <span>{item.label}</span>}
                // </button>
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
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background/70">
                    <Icon className="size-4" />
                  </div>

                  {!collapsed && <span>{item.label}</span>}
                </Link>
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
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
