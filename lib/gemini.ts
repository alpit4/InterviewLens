import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const apiKey = process.env.GEMINI_API_KEY!;
export const genAI = new GoogleGenerativeAI(apiKey);
export const fileManager = new GoogleAIFileManager(apiKey);

export const ANALYSIS_PROMPT = `You are an expert technical interviewer evaluating a candidate's interview performance based on the provided audio recording.

Analyze this interview and provide structured feedback in EXACT JSON format:

{
  "scores": {
    "technical_depth": 7,
    "communication": 8,
    "problem_solving": 6,
    "system_thinking": 5
  },
  "overall_score": 6.5,
  "strengths": [
    "Clear communication and structured thinking",
    "Asked clarifying questions before solving",
    "Explained tradeoffs between approaches"
  ],
  "weaknesses": [
    "Didn't discuss time complexity",
    "Missed edge cases in solution",
    "Limited system design knowledge"
  ],
  "improvements": [
    "Always analyze time and space complexity",
    "List edge cases before coding",
    "Practice distributed systems concepts"
  ],
  "hire_recommendation": "Maybe - Shows promise but needs more depth in system design",
  "transcript": "Full text of the interview transcription goes here..."
}

SCORING CRITERIA:
- Technical Depth: Understanding of concepts, ability to explain WHY
- Communication: Clarity, structure, articulation
- Problem-Solving: Approach, asking questions, handling unknowns
- System Thinking: Scalability, tradeoffs, edge cases

Return ONLY valid JSON, no markdown formatting.`;
