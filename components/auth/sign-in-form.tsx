"use client"

import Link from "next/link"
import { useActionState } from "react"
import { signIn, type AuthActionState } from "@/app/actions/auth"
import { AuthLayout } from "@/components/auth/auth-layout"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"

type SignInFormProps = {
  redirect?: string
  error?: string
}

export function SignInForm({ redirect, error: urlError }: SignInFormProps) {
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    signIn,
    {}
  )

  const error = state.error ?? urlError

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your account to continue"
    >
      <div className="space-y-6">
        <GoogleSignInButton />

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
            or continue with email
          </span>
        </div>

        <form action={formAction} className="space-y-4">
          {redirect && (
            <input type="hidden" name="redirect" value={redirect} />
          )}

          <FieldGroup>
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
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                disabled={pending}
              />
            </Field>
          </FieldGroup>

          {error && <FieldError>{error}</FieldError>}

          <Button
            type="submit"
            size="lg"
            className="h-10 w-full text-sm"
            disabled={pending}
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
