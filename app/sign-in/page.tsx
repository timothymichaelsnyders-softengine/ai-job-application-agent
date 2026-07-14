import { SignInForm } from "@/components/auth/sign-in-form"

type SignInPageProps = {
  searchParams: Promise<{
    redirect?: string
    error?: string
  }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams

  return (
    <SignInForm
      redirect={params.redirect}
      error={
        params.error === "auth_callback_failed"
          ? "Authentication failed. Please try again."
          : undefined
      }
    />
  )
}
