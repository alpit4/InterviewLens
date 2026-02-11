import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserSyncTrigger from "./UserSyncTrigger";

export default function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SignedIn>
        <UserSyncTrigger />
      </SignedIn>
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-blue-600">
              InterviewLens
            </span>
          </Link>
          <div className="hidden md:flex gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="/upload"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Analyze
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
