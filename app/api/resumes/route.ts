// BACKEND: Resumes CRUD API route
// Handles listing all resumes and creating new resumes

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureDatabaseTables } from '@/lib/db-init'; // TEMPORARY: Remove this line later

// GET: Retrieve all resumes
export async function GET(request: NextRequest) {
  try {
    // TEMPORARY: Ensure database tables exist - remove this line later
    await ensureDatabaseTables();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const resumes = await prisma.resume.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    const total = await prisma.resume.count();

    return NextResponse.json({
      success: true,
      resumes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

// POST: Create a new resume manually
export async function POST(request: NextRequest) {
  try {
    // TEMPORARY: Ensure database tables exist - remove this line later
    await ensureDatabaseTables();
    
    const body = await request.json();

    const resume = await prisma.resume.create({
      data: {
        fileName: body.fileName || 'manual_entry',
        fileType: body.fileType || 'manual',
        fullName: body.fullName || null,
        email: body.email || null,
        phone: body.phone || null,
        lastJob: body.lastJob || null,
        lastCompany: body.lastCompany || null,
        yearsExperience: body.yearsExperience || null,
        technicalSkills: body.technicalSkills || [],
        education: body.education || null,
        summary: body.summary || null,
      },
    });

    return NextResponse.json({
      success: true,
      resume,
    });

  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json(
      { error: 'Failed to create resume' },
      { status: 500 }
    );
  }
}

