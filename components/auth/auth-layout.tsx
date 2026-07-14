import Link from "next/link"
import { Briefcase01Icon, SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type AuthLayoutProps = {
  children: React.ReactNode
  title: string
  description: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-full flex-1">
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(0.35_0.08_250),oklch(0.15_0.02_260))]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggIGQ9Ik0zNiAzNGg0djRoLTR6bTAtNDBoNHY0aC00ek0wIDM0aDR2NEgwek0wIDBoNHY0SDB6bTE2IDBoNHY0aC00ek0wIDE2aDR2NEgwek0xNiAw aDR2NGgtNHptMjQgMGg0djRoLTR6bTAgMTZoNHY0aC00ek0xNiAzNGg0djRoLTR6bTAgMTZoNHY0aC00ek0zNiAxNmg0djRoLTR6bTAgMTZoNHY0aC00ek0wIDMyaDR2NEgwek0zNiAwaDR2NGgtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />

        <div className="relative z-10 flex flex-col gap-8 p-12">
          <Link href="/" className="flex items-center gap-3 text-white">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
              <HugeiconsIcon icon={Briefcase01Icon} className="size-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              AI Job Agent
            </span>
          </Link>

          <div className="mt-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/20 backdrop-blur-sm">
              <HugeiconsIcon icon={SparklesIcon} className="size-3.5" />
              Smart job applications
            </div>
            <blockquote className="max-w-md text-2xl font-medium leading-snug tracking-tight text-white">
              Land your next role faster with AI-powered applications tailored
              to every job.
            </blockquote>
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              Track applications, generate cover letters, and apply with
              confidence — all in one place.
            </p>
          </div>
        </div>

        <div className="relative z-10 p-12 text-xs text-white/50">
          © {new Date().getFullYear()} AI Job Agent
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium lg:hidden"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <HugeiconsIcon icon={Briefcase01Icon} className="size-4" />
              </div>
              AI Job Agent
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
