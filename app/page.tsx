import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Briefcase01Icon, SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HugeiconsIcon icon={Briefcase01Icon} className="size-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              AI Job Agent
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" render={<Link href="/sign-in" />}>
              Sign in
            </Button>
            <Button size="sm" render={<Link href="/sign-up" />}>
              Get started
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-10 px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
          <HugeiconsIcon icon={SparklesIcon} className="size-3.5" />
          AI-powered job applications
        </div>

        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Apply smarter.
            <br />
            Land faster.
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            AI Job Agent helps you tailor applications, track progress, and
            manage your job search — all from one dashboard.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="h-10 px-6 text-sm" render={<Link href="/sign-up" />}>
            Create free account
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-10 px-6 text-sm"
            render={<Link href="/sign-in" />}
          >
            Sign in
          </Button>
        </div>
      </main>
    </div>
  )
}
