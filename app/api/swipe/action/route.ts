// BACKEND: Swipe action API route
// Handles like/pass actions on profiles

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

// POST: Record a like or pass action
export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const body = await request.json();

    const { profileId, action } = body;

    if (!profileId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: profileId and action' },
        { status: 400 }
      );
    }

    if (action !== 'like' && action !== 'pass') {
      return NextResponse.json(
        { error: 'Invalid action. Must be "like" or "pass"' },
        { status: 400 }
      );
    }

    // Verify the profile exists
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Prevent users from liking their own profile
    if (profile.userId === user.userId) {
      return NextResponse.json(
        { error: 'Cannot like your own profile' },
        { status: 400 }
      );
    }

    // Upsert the like/pass action (create or update if already exists)
    const like = await prisma.like.upsert({
      where: {
        userId_profileId: {
          userId: user.userId,
          profileId: profileId,
        },
      },
      update: {
        action: action,
      },
      create: {
        userId: user.userId,
        profileId: profileId,
        action: action,
      },
    });

    return NextResponse.json({
      success: true,
      like,
    });

  } catch (error) {
    console.error('Error recording swipe action:', error);
    return NextResponse.json(
      { error: 'Failed to record action' },
      { status: 500 }
    );
  }
}

