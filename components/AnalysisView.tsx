"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AnalysisReport from "@/components/AnalysisReport";
import { Loader2, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AnalysisView({ id }: { id: string }) {
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInterview = async () => {
    try {
      const res = await fetch(`/api/interviews/${id}`);
      if (!res.ok) throw new Error("Interview not found");
      const data = await res.json();
      setInterview(data);

      // Stop polling if completed or failed
      if (data.status === "completed" || data.status === "failed") {
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterview();

    // Polling every 5 seconds if not finished
    const interval = setInterval(() => {
      if (interview?.status !== "completed" && interview?.status !== "failed") {
        fetchInterview();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, interview?.status]);

  if (loading && !interview) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-lg font-medium">Loading your report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 p-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">{error}</p>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {interview.status === "completed" ? (
          <AnalysisReport analysis={interview.analysis} />
        ) : interview.status === "failed" ? (
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50 dark:bg-red-900/10">
            <CardContent className="p-8 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-bold text-red-900 dark:text-red-400">
                Analysis Failed
              </h2>
              <p className="text-red-700 dark:text-red-300">
                We encountered an error while analyzing your interview. Please
                try re-uploading the file.
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-2xl mx-auto overflow-hidden">
            <div className="bg-blue-600 h-1.5 w-full animate-progress" />
            <CardContent className="p-12 text-center space-y-6">
              <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 w-fit mx-auto">
                <Clock className="h-10 w-10 text-blue-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold capitalize">
                  {interview.status}...
                </h2>
                <p className="text-muted-foreground">
                  Our AI is currently processing your recording. This page will
                  automatically update when your report is ready.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing {interview.fileName}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
