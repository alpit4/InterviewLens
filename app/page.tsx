import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Clock, Lock, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center space-y-8">
        <div className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-sm font-medium">
          <Sparkles className="mr-2 h-4 w-4 text-blue-600" />
          <span>AI-Powered Interview Insights</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Master Your Next <br />
          <span className="text-blue-600">Technical Interview</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your interview recordings and get instant, detailed feedback on
          your technical depth, communication, and problem-solving skills.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/upload">
            <Button size="lg" className="h-12 px-8 text-md gap-2">
              Start Analysis Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="h-12 px-8 text-md">
              View History
            </Button>
          </Link>
        </div>

        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto opacity-50 grayscale">
          {/* Mock logos or badges could go here */}
          <div className="flex items-center justify-center font-bold text-xl italic">
            Google
          </div>
          <div className="flex items-center justify-center font-bold text-xl italic">
            Amazon
          </div>
          <div className="flex items-center justify-center font-bold text-xl italic">
            Microsoft
          </div>
          <div className="flex items-center justify-center font-bold text-xl italic">
            Meta
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Why InterviewLens?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to improve your performance and land your
              dream job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-background p-8 rounded-2xl shadow-sm border space-y-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Detailed Scoring</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get granular scores for technical depth, communication,
                problem-solving, and system thinking.
              </p>
            </div>

            <div className="bg-background p-8 rounded-2xl shadow-sm border space-y-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Instant Feedback</h3>
              <p className="text-muted-foreground leading-relaxed">
                No more waiting for human review. Get actionable feedback and
                improvement steps within seconds.
              </p>
            </div>

            <div className="bg-background p-8 rounded-2xl shadow-sm border space-y-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Private & Secure</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your recordings are yours alone. We use industry-standard
                encryption to keep your data safe and private.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
          <p className="text-sm">© 2026 InterviewLens</p>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Twitter</Link>
            <Link href="https://github.com">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
