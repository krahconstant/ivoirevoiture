import Link from "next/link"
import { getSession } from "@/lib/auth"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"

export async function SiteHeader() {
  const session = await getSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold">IvoireVoiture</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            {session?.user ? (
              <UserNav user={session.user} />
            ) : (
              <Link
                href="/auth/login"
                className="rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 flex items-center justify-center"
              >
                <span className="sr-only">Se connecter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

