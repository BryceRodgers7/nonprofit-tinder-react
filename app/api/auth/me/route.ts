// BACKEND: Get current user API route
// Returns current user info based on JWT token

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    const { user: tokenUser } = authResult;

    // Get full user info from database
    const user = await prisma.appUser.findUnique({
      where: { id: tokenUser.userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error('Error in /auth/me route:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

