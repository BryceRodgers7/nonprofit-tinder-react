// BACKEND: Swipe profiles API route
// Fetches all profiles for swiping (excluding current user's profile)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

// GET: Retrieve all profiles except the current user's profile
export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    // Fetch all profiles except the current user's, including user data
    // Only include profiles that have at least organizationName filled in
    const profiles = await prisma.profile.findMany({
      where: {
        userId: {
          not: user.userId,
        },
        organizationName: {
          not: null,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      profiles,
    });

  } catch (error) {
    console.error('Error fetching swipe profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

