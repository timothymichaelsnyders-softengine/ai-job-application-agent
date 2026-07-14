"use client"

import Link from "next/link"
import { useActionState } from "react"
import { signUp, type AuthActionState } from "@/app/actions/auth"
import { AuthLayout } from "@/components/auth/auth-layout"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"

export function SignUpForm() {
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    signUp,
    {}
  )

  return (
    <AuthLayout
      title="Create an account"
      description="Get started with AI Job Agent in seconds"
    >
      <div className="space-y-6">
        <GoogleSignInButton />

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
            or sign up with email
          </span>
        </div>

        <form action={formAction} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fullName">Full name</FieldLabel>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Jane Doe"
                autoComplete="name"
                disabled={pending}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={pending}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={6}
                disabled={pending}
              />
              <FieldDescription>
                Must be at least 6 characters
              </FieldDescription>
            </Field>
          </FieldGroup>

          {state.error && <FieldError>{state.error}</FieldError>}

          <Button
            type="submit"
            size="lg"
            className="h-10 w-full text-sm"
            disabled={pending}
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
