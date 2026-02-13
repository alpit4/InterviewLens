import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const userDetails = await currentUser();

    if (!userId || !userDetails) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { secure_url, fileName, fileType, duration } = await req.json();

    if (!secure_url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: userDetails.emailAddresses[0].emailAddress,
          name: `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || 'User',
        }
      });
    }

    const interview = await prisma.interview.create({
      data: {
        userId: user.id,
        fileName: fileName || 'Recording',
        fileUrl: secure_url,
        fileType: fileType || 'audio',
        duration: duration ? Math.round(duration) : null,
        status: 'uploaded'
      }
    });

    return NextResponse.json({ 
      success: true, 
      interviewId: interview.id 
    });
  } catch (error) {
    console.error('Upload Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
