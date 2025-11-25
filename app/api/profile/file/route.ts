// BACKEND: Profile file reference API route
// Updates only the file metadata (fileName, s3Key, s3Url) without affecting other profile fields

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

// PUT: Update only file reference fields in the user's profile
export async function PUT(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const body = await request.json();
    const { fileName, s3Key, s3Url } = body;

    // Validate that we have the required S3 fields
    if (!fileName || !s3Key || !s3Url) {
      return NextResponse.json(
        { error: 'fileName, s3Key, and s3Url are required' },
        { status: 400 }
      );
    }

    // Update ONLY the file reference fields, leave all other fields unchanged
    const profile = await prisma.profile.upsert({
      where: { userId: user.userId },
      update: {
        fileName,
        s3Key,
        s3Url,
      },
      create: {
        userId: user.userId,
        fileName,
        s3Key,
        s3Url,
        organizationName: null,
        ein: null,
        missionStatement: null,
        yearFounded: null,
        locationServed: null,
        biggestAccomplishment: null,
        oneSentenceSummary: null,
        legalDesignation: null,
        primaryCauseAreas: [],
        populations: [],
        geographicalFocus: null,
      },
    });

    return NextResponse.json({
      success: true,
      profile,
    });

  } catch (error) {
    console.error('Error updating file reference:', error);
    return NextResponse.json(
      { error: 'Failed to update file reference' },
      { status: 500 }
    );
  }
}

