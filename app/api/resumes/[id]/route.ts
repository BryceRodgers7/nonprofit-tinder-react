// BACKEND: Individual Resume CRUD API route
// Handles getting, updating, and deleting specific resumes by ID

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureDatabaseTables } from '@/lib/db-init'; // TEMPORARY: Remove this line later

// GET: Retrieve a specific resume by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TEMPORARY: Ensure database tables exist - remove this line later
    await ensureDatabaseTables();
    
    const resume = await prisma.resume.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      resume,
    });

  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}

// PUT: Update a resume
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TEMPORARY: Ensure database tables exist - remove this line later
    await ensureDatabaseTables();
    
    const body = await request.json();

    const resume = await prisma.resume.update({
      where: {
        id: params.id,
      },
      data: {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        lastJob: body.lastJob,
        lastCompany: body.lastCompany,
        yearsExperience: body.yearsExperience,
        technicalSkills: body.technicalSkills,
        education: body.education,
        summary: body.summary,
      },
    });

    return NextResponse.json({
      success: true,
      resume,
    });

  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json(
      { error: 'Failed to update resume' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a resume
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TEMPORARY: Ensure database tables exist - remove this line later
    await ensureDatabaseTables();
    
    await prisma.resume.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}

