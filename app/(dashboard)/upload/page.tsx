import FileUploader from "@/components/FileUploader";
import Navbar from "@/components/Navbar";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Analyze Your Interview
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your interview recording and let our AI provide detailed
              feedback on your performance.
            </p>
          </div>

          <div className="bg-card rounded-xl border shadow-sm p-4 md:p-8">
            <FileUploader />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="p-6 rounded-lg border bg-blue-50/50 dark:bg-blue-900/10">
              <h3 className="font-bold mb-2">1. Upload</h3>
              <p className="text-sm text-muted-foreground">
                Upload any audio or video recording of your mock or real
                interview.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-purple-50/50 dark:bg-purple-900/10">
              <h3 className="font-bold mb-2">2. AI Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Our AI transcribes and evaluates your technical depth and
                communication.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-green-50/50 dark:bg-green-900/10">
              <h3 className="font-bold mb-2">3. Improve</h3>
              <p className="text-sm text-muted-foreground">
                Get actionable steps and specific feedback to ace your next
                round.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
