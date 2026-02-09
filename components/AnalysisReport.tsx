"use client";

import {
  CheckCircle,
  XCircle,
  Lightbulb,
  Target,
  MessageSquare,
  Brain,
  Code,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AnalysisReportProps {
  analysis: {
    scores: {
      technical_depth: number;
      communication: number;
      problem_solving: number;
      system_thinking: number;
    };
    overall_score: number;
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
    hire_recommendation: string;
    transcript?: string;
  };
}

const scoreIcons = {
  technical_depth: Code,
  communication: MessageSquare,
  problem_solving: Brain,
  system_thinking: Target,
};

export default function AnalysisReport({ analysis }: AnalysisReportProps) {
  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-600 dark:text-green-400";
    if (score >= 5) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 7) return "bg-green-100/50 dark:bg-green-900/10";
    if (score >= 5) return "bg-yellow-100/50 dark:bg-yellow-900/10";
    return "bg-red-100/50 dark:bg-red-900/10";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Overall Score Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-sm font-medium uppercase tracking-wider text-blue-100">
              Overall Performance
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black">
                {analysis.overall_score}
              </span>
              <span className="text-2xl font-bold opacity-70">/ 10</span>
            </div>
          </div>
          <div className="max-w-md bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-bold mb-1">Hire Recommendation</h3>
            <p className="text-blue-50 leading-relaxed font-medium">
              {analysis.hire_recommendation}
            </p>
          </div>
        </div>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
      </div>

      {/* Score Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(analysis.scores).map(([key, value]) => {
          const Icon = scoreIcons[key as keyof typeof scoreIcons] || Target;
          return (
            <Card key={key} className={`border-none ${getScoreBg(value)}`}>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2 rounded-lg bg-white/50 dark:bg-black/20 ${getScoreColor(value)}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-2xl font-bold ${getScoreColor(value)}`}
                  >
                    {value}/10
                  </span>
                </div>
                <h3 className="font-bold text-sm uppercase tracking-tight opacity-70">
                  {key.replace("_", " ")}
                </h3>
                <Progress value={value * 10} className="h-1.5" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths */}
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
            <div className="p-2 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
            </div>
            <CardTitle>Top Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {analysis.strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-sm md:text-base">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
            <div className="p-2 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <XCircle className="h-5 w-5" />
            </div>
            <CardTitle>Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {analysis.weaknesses.map((weakness, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="text-sm md:text-base">{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card className="border-none shadow-md bg-blue-50/30 dark:bg-blue-900/10">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
          <div className="p-2 rounded-lg bg-blue-600 text-white">
            <Lightbulb className="h-5 w-5" />
          </div>
          <CardTitle>Next Steps & Action Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analysis.improvements.map((improvement, i) => (
              <div
                key={i}
                className="relative p-6 rounded-xl bg-background border shadow-sm transition-transform hover:-translate-y-1"
              >
                <span className="absolute top-4 right-4 text-4xl font-black text-blue-500/10">
                  {i + 1}
                </span>
                <p className="relative z-10 font-medium">{improvement}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transcript (Optional) */}
      {analysis.transcript && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Interview Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto rounded-lg bg-muted/30 p-6 text-sm leading-relaxed text-muted-foreground">
              {analysis.transcript.split("\n").map((line, i) => (
                <p key={i} className="mb-2">
                  {line}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
