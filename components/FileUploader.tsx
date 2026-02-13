"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileVideo,
  FileAudio,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "processing" | "success" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setStatus("uploading");
      setProgress(5);

      // 1. Get Signature from our server
      const signRes = await fetch("/api/upload/sign", { method: "POST" });
      if (!signRes.ok) throw new Error("Failed to get upload signature");
      const { signature, timestamp, cloudName, apiKey } = await signRes.json();

      // 2. Upload directly to Cloudinary
      const cloudData = new FormData();
      cloudData.append("file", file);
      cloudData.append("api_key", apiKey);
      cloudData.append("timestamp", timestamp);
      cloudData.append("signature", signature);
      cloudData.append("folder", "interviews");

      const xhr = new XMLHttpRequest();
      const cloudUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;
            setProgress(Math.round(percent * 0.8)); // 0-80% for upload
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error("Cloudinary upload failed"));
          }
        });

        xhr.addEventListener("error", () =>
          reject(new Error("Network error during upload")),
        );
        xhr.open("POST", cloudUrl);
        xhr.send(cloudData);
      });

      const uploadResult = (await uploadPromise) as {
        secure_url: string;
        duration?: number;
      };

      setProgress(85);
      setStatus("processing");

      // 3. Create Record in our DB
      const dbRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secure_url: uploadResult.secure_url,
          fileName: file.name,
          fileType: file.type.startsWith("video") ? "video" : "audio",
          duration: uploadResult.duration,
        }),
      });

      if (!dbRes.ok) throw new Error("Failed to save recording information");
      const { interviewId } = (await dbRes.json()) as { interviewId: string };

      setProgress(90);

      // 4. Start AI Processing
      const processRes = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId }),
      });

      if (!processRes.ok) throw new Error("AI processing failed");

      setProgress(100);
      setStatus("success");

      // 5. Redirect to analysis page
      setTimeout(() => {
        router.push(`/analysis/${interviewId}`);
      }, 1500);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setStatus("error");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="relative border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted/80 overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-12 text-center">
          {!file ? (
            <>
              <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900/20">
                <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-muted-foreground">
                  Video or Audio files (max 50MB)
                </p>
              </div>
              <input
                type="file"
                accept="video/*,audio/*"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </>
          ) : (
            <>
              <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
                {file.type.startsWith("video") ? (
                  <FileVideo className="h-8 w-8 text-green-600 dark:text-green-400" />
                ) : (
                  <FileAudio className="h-8 w-8 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              {status === "idle" && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setFile(null)}>
                    Change
                  </Button>
                  <Button onClick={handleUpload}>Start Analysis</Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {status !== "idle" && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between font-medium">
              <span className="flex items-center gap-2">
                {status === "processing" && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                )}
                {status === "success" && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                {status === "error" && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                {status === "uploading"
                  ? "Uploading recording..."
                  : status === "processing"
                    ? "AI is analyzing your interview..."
                    : status === "success"
                      ? "Analysis Complete!"
                      : "Error encountered"}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            {error && (
              <p className="text-sm text-red-500 text-center font-medium">
                {error}
              </p>
            )}
            {status === "processing" && (
              <p className="text-xs text-muted-foreground text-center animate-pulse">
                This may take a few moments depending on the recording length.
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
