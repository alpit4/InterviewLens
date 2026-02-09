import { prisma } from '@/lib/prisma';
import { genAI, fileManager, ANALYSIS_PROMPT } from '@/lib/gemini';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';

export async function POST(req: Request) {
  try {
    const { interviewId } = await req.json();

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId }
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    // Update status to transcribing
    await prisma.interview.update({
      where: { id: interviewId },
      data: { status: 'transcribing' }
    });

    // 1. Download file from Cloudinary to temp loc
    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `input_${interviewId}_${Date.now()}`);
    const outputPath = path.join(tempDir, `output_${interviewId}_${Date.now()}.mp3`);

    const response = await axios({
      method: 'get',
      url: interview.fileUrl,
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(inputPath);
    response.data.pipe(writer);

    await new Promise<void>((resolve, reject) => {
      writer.on('finish', () => resolve());
      writer.on('error', (err) => reject(err));
    });

    // 2. Extract Audio if it's a video
    let processPath = inputPath;
    if (interview.fileType === 'video') {
      await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .toFormat('mp3')
          .on('end', () => resolve(true))
          .on('error', (err) => reject(err))
          .save(outputPath);
      });
      processPath = outputPath;
    }

    // Update status to analyzing
    await prisma.interview.update({
      where: { id: interviewId },
      data: { status: 'analyzing' }
    });

    // 3. Upload to Gemini File API
    const uploadResult = await fileManager.uploadFile(processPath, {
      mimeType: 'audio/mp3',
      displayName: interview.fileName,
    });

    // 4. Generate Analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri
        }
      },
      { text: ANALYSIS_PROMPT },
    ]);

    const responseText = result.response.text();
    
    // Clean JSON response
    const cleanJson = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const analysis = JSON.parse(cleanJson);

    // 5. Update Database
    await prisma.interview.update({
      where: { id: interviewId },
      data: { 
        analysis,
        transcript: analysis.transcript || null,
        status: 'completed'
      }
    });

    // Clean up temp files
    try {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    } catch (e) {
      console.error('Cleanup error:', e);
    }

    return NextResponse.json({ success: true, analysis });

  } catch (error) {
    console.error('Processing Error:', error);
    
    // Attempt to mark as failed
    try {
      const { interviewId } = await req.json();
      if (interviewId) {
        await prisma.interview.update({
          where: { id: interviewId },
          data: { status: 'failed' }
        });
      }
    } catch {
      // Ignore secondary errors in catch block
    }

    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
