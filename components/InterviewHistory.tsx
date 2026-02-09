"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileVideo,
  FileAudio,
  Calendar,
  ChevronRight,
  BarChart2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function InterviewHistory() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/interviews")
      .then((res) => res.json())
      .then((data) => {
        setInterviews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
          <div className="p-4 rounded-full bg-muted">
            <BarChart2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-lg">No interviews analyzed yet</p>
            <p className="text-sm text-muted-foreground">
              Upload your first recording to see insights.
            </p>
          </div>
          <Link href="/upload">
            <Button>Start First Analysis</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {interviews.map((interview) => (
        <Link key={interview.id} href={`/analysis/${interview.id}`}>
          <Card className="group transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row sm:items-center">
                {/* Status Indicator Bar */}
                <div
                  className={`w-full sm:w-1.5 h-1.5 sm:h-auto self-stretch ${
                    interview.status === "completed"
                      ? "bg-green-500"
                      : interview.status === "failed"
                        ? "bg-red-500"
                        : "bg-blue-500"
                  }`}
                />

                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400">
                      {interview.fileType === "video" ? (
                        <FileVideo className="h-6 w-6" />
                      ) : (
                        <FileAudio className="h-6 w-6" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold truncate max-w-[200px] md:max-w-xs">
                        {interview.fileName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(interview.createdAt).toLocaleDateString()}
                        </span>
                        {interview.duration && (
                          <span>
                            {Math.floor(interview.duration / 60)}m{" "}
                            {interview.duration % 60}s
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {interview.status === "completed" &&
                      interview.analysis?.overall_score && (
                        <div className="text-right hidden md:block">
                          <p className="text-sm font-medium text-muted-foreground">
                            Score
                          </p>
                          <p className="text-2xl font-black text-blue-600">
                            {interview.analysis.overall_score}
                          </p>
                        </div>
                      )}

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          interview.status === "completed"
                            ? "default"
                            : interview.status === "failed"
                              ? "destructive"
                              : "secondary"
                        }
                        className="capitalize py-1 px-3"
                      >
                        {interview.status}
                      </Badge>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
