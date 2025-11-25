// BACKEND: Profile CRUD API route
// Handles getting and updating the user's non-profit organization profile

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

// GET: Retrieve the current user's profile
export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    const profile = await prisma.profile.findUnique({
      where: { userId: user.userId },
    });

    if (!profile) {
      return NextResponse.json({
        success: true,
        profile: null,
      });
    }

    return NextResponse.json({
      success: true,
      profile,
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// POST: Create a new profile for the current user
export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: user.userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists. Use PUT to update.' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const profile = await prisma.profile.create({
      data: {
        userId: user.userId,
        fileName: body.fileName || null,
        s3Key: body.s3Key || null,
        s3Url: body.s3Url || null,
        organizationName: body.organizationName || null,
        ein: body.ein || null,
        missionStatement: body.missionStatement || null,
        yearFounded: body.yearFounded || null,
        locationServed: body.locationServed || null,
        biggestAccomplishment: body.biggestAccomplishment || null,
        oneSentenceSummary: body.oneSentenceSummary || null,
        legalDesignation: body.legalDesignation || null,
        primaryCauseAreas: body.primaryCauseAreas || [],
        populations: body.populations || [],
        geographicalFocus: body.geographicalFocus || null,
      },
    });

    return NextResponse.json({
      success: true,
      profile,
    });

  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}

// PUT: Update the current user's profile
export async function PUT(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    const body = await request.json();

    // Upsert: create if doesn't exist, update if exists
    const profile = await prisma.profile.upsert({
      where: { userId: user.userId },
      update: {
        fileName: body.fileName,
        s3Key: body.s3Key,
        s3Url: body.s3Url,
        organizationName: body.organizationName,
        ein: body.ein,
        missionStatement: body.missionStatement,
        yearFounded: body.yearFounded,
        locationServed: body.locationServed,
        biggestAccomplishment: body.biggestAccomplishment,
        oneSentenceSummary: body.oneSentenceSummary,
        legalDesignation: body.legalDesignation,
        primaryCauseAreas: body.primaryCauseAreas,
        populations: body.populations,
        geographicalFocus: body.geographicalFocus,
      },
      create: {
        userId: user.userId,
        fileName: body.fileName || null,
        s3Key: body.s3Key || null,
        s3Url: body.s3Url || null,
        organizationName: body.organizationName || null,
        ein: body.ein || null,
        missionStatement: body.missionStatement || null,
        yearFounded: body.yearFounded || null,
        locationServed: body.locationServed || null,
        biggestAccomplishment: body.biggestAccomplishment || null,
        oneSentenceSummary: body.oneSentenceSummary || null,
        legalDesignation: body.legalDesignation || null,
        primaryCauseAreas: body.primaryCauseAreas || [],
        populations: body.populations || [],
        geographicalFocus: body.geographicalFocus || null,
      },
    });

    return NextResponse.json({
      success: true,
      profile,
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// DELETE: Delete the current user's profile
export async function DELETE(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    await prisma.profile.delete({
      where: { userId: user.userId },
    });

    return NextResponse.json({
      success: true,
      message: 'Profile deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
}

