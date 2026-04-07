import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { SignInButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"

export default async function Page() {
  const { userId } = await auth()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 text-center">
      <div className="flex max-w-lg flex-col items-center gap-6">
        <h1 className="text-6xl font-bold tracking-tight text-primary">
          FindTime
        </h1>
        <p className="text-xl leading-relaxed text-muted-foreground">
          The seamless way to schedule full-day events. Pick a date range, share
          the link with friends, and see everyone&apos;s availability instantly
          in a visual heatmap.
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          {userId ? (
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium whitespace-nowrap text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Go to Dashboard
            </Link>
          ) : (
            <SignInButton mode="modal">
              <Button size="lg" className="text-md px-8 font-medium">
                Get Started for Free
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  )
}
