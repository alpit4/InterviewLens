import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const userDetails = await currentUser();

    if (!userId || !userDetails) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, 'interviews') as { secure_url: string, duration?: number };

    // Ensure the user exists in our local database
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
        fileName: file.name,
        fileUrl: result.secure_url,
        fileType: file.type.startsWith('video') ? 'video' : 'audio',
        duration: result.duration ? Math.round(result.duration) : null,
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
