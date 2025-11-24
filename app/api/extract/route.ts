// BACKEND: OpenAI extraction API route
// Uses GPT to extract structured resume data and saves to Supabase database

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import { ensureDatabaseTables } from '@/lib/db-init'; // TEMPORARY: Remove this line later

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // TEMPORARY: Ensure database tables exist - remove this line later
    await ensureDatabaseTables();
    
    const body = await request.json();
    const { extractedText, fileName, fileType } = body;

    if (!extractedText) {
      return NextResponse.json(
        { error: 'No text provided for extraction' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Call OpenAI API with structured extraction prompt
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a resume parser. Extract the following information from the resume text and return it as JSON:
- fullName: The person's full name
- email: Email address
- phone: Phone number
- lastJob: Most recent job title
- lastCompany: Most recent company name
- yearsExperience: Total years of professional experience (as a string, e.g., "5", "3-5", etc.)
- technicalSkills: Array of technical skills (programming languages, frameworks, tools, etc.)
- education: Education summary (degrees, schools, years)
- summary: Professional summary or objective (2-3 sentences)

If any field is not found, set it to null (except technicalSkills which should be an empty array).
Return ONLY valid JSON, no additional text.`
        },
        {
          role: 'user',
          content: extractedText
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    console.log('responseContent', responseContent);

    if (!responseContent) {
      return NextResponse.json(
        { error: 'Failed to extract data from OpenAI' },
        { status: 500 }
      );
    }

    const extractedData = JSON.parse(responseContent);

    // Save to database via Prisma
    const resume = await prisma.resume.create({
      data: {
        fileName: fileName || 'unknown',
        fileType: fileType || 'unknown',
        fullName: extractedData.fullName || null,
        email: extractedData.email || null,
        phone: extractedData.phone || null,
        lastJob: extractedData.lastJob || null,
        lastCompany: extractedData.lastCompany || null,
        yearsExperience: extractedData.yearsExperience || null,
        technicalSkills: extractedData.technicalSkills || [],
        education: extractedData.education || null,
        summary: extractedData.summary || null,
      },
    });

    return NextResponse.json({
      success: true,
      resume: resume,
    });

  } catch (error) {
    console.error('Error in extract route:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to extract resume data: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An error occurred while extracting resume data.' },
      { status: 500 }
    );
  }
}

