import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { userId } = await auth();
    const userDetails = await currentUser();

    if (!userId || !userDetails) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email: userDetails.emailAddresses[0].emailAddress,
        name: `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || 'User',
      },
      create: {
        clerkId: userId,
        email: userDetails.emailAddresses[0].emailAddress,
        name: `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || 'User',
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('User Sync Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
