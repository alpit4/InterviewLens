import InterviewHistory from "@/components/InterviewHistory";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Your Interviews
              </h1>
              <p className="text-muted-foreground">
                Manage and review your past interview performances.
              </p>
            </div>
            <Link href="/upload">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Analysis
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            <InterviewHistory />
          </div>
        </div>
      </main>
    </div>
  );
}
