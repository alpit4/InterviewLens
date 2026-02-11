# InterviewLens 🎯

InterviewLens is an AI-powered interview analysis platform designed to help developers master their technical and behavioral interviews. By leveraging advanced AI models, it provides granular feedback on performance, technical depth, and communication skills.

## 🚀 Phase 1: Core Foundation (Implemented)

The foundational phase is complete and ready for use. Current features include:

- **AI Interview Analysis**: Upload video or audio recordings of your mock interviews.
- **Smart Pipeline**: Automatic audio extraction via server-side FFmpeg for optimized Gemini 1.5 Flash processing.
- **Detailed Insights**: Receive categorized feedback on:
  - Technical Depth
  - Communication Skills
  - Problem Solving
  - System Thinking
- **Premium Dashboard**: Manage and review your past interview performances.
- **Secure Auth**: Full integration with Clerk (Email & Google Sign-in).
- **Cloud Storage**: Integrated with Cloudinary for reliable media storage.
- **User Sync**: Proactive database synchronization for a seamless onboarding experience.

## 📅 Future Roadmap

### Phase 2: Resume & Matching (Coming Soon)
- Resume parsing and optimization.
- Smart matching between interview performance and job requirements.

### Phase 3: AI Integrity Patterns
- Detection of cheating patterns or "reading from notes" using behavioral AI.
- Eye-tracking and focus consistency analysis.

### Phase 4: Mock Interview Simulator
- Real-time AI interviewer with adaptive difficulty.
- Live feedback and "stop-and-fix" coaching mode.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [PostgreSQL (Neon)](https://neon.tech/) with [Prisma ORM](https://www.prisma.io/)
- **AI Media Analysis**: [Google Gemini 1.5 Flash](https://aistudio.google.com/)
- **Storage**: [Cloudinary](https://cloudinary.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Media Processing**: [FFmpeg](https://ffmpeg.org/)

## 🏁 Getting Started

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/InterviewLens.git
    cd InterviewLens
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env.local` file and add your credentials:
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
    CLERK_SECRET_KEY=...
    DATABASE_URL=...
    CLOUDINARY_CLOUD_NAME=...
    CLOUDINARY_API_KEY=...
    CLOUDINARY_API_SECRET=...
    GEMINI_API_KEY=...
    ```

4.  **Database Migration**:
    ```bash
    npx prisma db push
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```

---
*Empowering developers to land their dream jobs with AI-driven insights.*
