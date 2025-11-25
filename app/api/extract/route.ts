// BACKEND: OpenAI extraction API route
// Uses GPT to extract structured resume data and saves to Supabase database

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import { ensureDatabaseTables } from '@/lib/db-init'; // TEMPORARY: Remove this line later
import { GEOGRAPHIC_FOCUS_OPTIONS, LEGAL_DESIGNATION_OPTIONS, POPULATIONS, PRIMARY_CAUSE_AREAS } from '@/lib/profile-constants';

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
          content: `You are an information extraction engine.
    Given a proposal or organizational document as raw text, extract the following fields:
    - full_organization_name
    - legal_designation: This should be a single string. Select one legal designation from this exact list: ${LEGAL_DESIGNATION_OPTIONS.join(', ')}. Match the text as closely as possible to one of these options. Common variations: "501c3" or "501(c)3" should map to "501(c)(3) – Public Charity" or "501(c)(3) – Private Foundation" based on context. "501c4" should map to "501(c)(4) – Social Welfare Organization", etc.
    - mission_statement
    - ein
    - year_founded
    - location_served
    - biggest_accomplishment
    - what_we_do_in_one_sentence
    - primary_cause_areas: This should be a JSON array of strings. Select one or more cause areas from this exact list: ${PRIMARY_CAUSE_AREAS.join(', ')}. Match the text as closely as possible to one of these options. If none match exactly, use "Other".
    - populations: This should be a JSON array of strings. Select one or more populations from this exact list: ${POPULATIONS.join(', ')}. Match the text as closely as possible to one of these options. If none match exactly, use "Other".
    - geographic_focus: This should be a single string. Select one geographic focus from this exact list: ${GEOGRAPHIC_FOCUS_OPTIONS.join(', ')}. Match the text as closely as possible to one of these options.

    Return ONLY a JSON object with these keys.
    If some value is missing, use an empty string for text fields or an empty array [] for primary_cause_areas and populations.`
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

    return NextResponse.json({
      success: true,
      extractedData: extractedData,
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

