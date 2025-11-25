// BACKEND: Profile extraction API route
// Uses GPT to extract non-profit organization data from proposal documents

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    const body = await request.json();
    const { extractedText, fileName, s3Key, s3Url } = body;

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

    // Call OpenAI API with structured extraction prompt for non-profit data
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a non-profit organization profile parser. Extract the following information from the proposal/document text and return it as JSON:

- organizationName: The name of the non-profit organization
- ein: Employer Identification Number (EIN/Tax ID)
- missionStatement: The organization's mission statement
- yearFounded: The year the organization was founded (as a string)
- locationServed: Geographic location or area served by the organization
- biggestAccomplishment: Their biggest or most notable accomplishment
- oneSentenceSummary: What they do summarized in one sentence
- legalDesignation: Legal designation (e.g., 501(c)(3), charitable organization, etc.)
- primaryCauseAreas: Array of primary cause areas (e.g., ["Education", "Health", "Environment"])
- populations: Array of populations served (e.g., ["Children", "Veterans", "Low-income families"])
- geographicalFocus: Geographical focus (e.g., "Local", "National", "International", or specific regions)

If any field is not found in the text, set it to null (except primaryCauseAreas and populations which should be empty arrays).
Be thorough and extract as much relevant information as possible from the document.
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

    if (!responseContent) {
      return NextResponse.json(
        { error: 'Failed to extract data from OpenAI' },
        { status: 500 }
      );
    }

    const extractedData = JSON.parse(responseContent);

    // Upsert profile - create or update the user's profile
    const profile = await prisma.profile.upsert({
      where: { userId: user.userId },
      update: {
        fileName: fileName || null,
        s3Key: s3Key || null,
        s3Url: s3Url || null,
        organizationName: extractedData.organizationName || null,
        ein: extractedData.ein || null,
        missionStatement: extractedData.missionStatement || null,
        yearFounded: extractedData.yearFounded || null,
        locationServed: extractedData.locationServed || null,
        biggestAccomplishment: extractedData.biggestAccomplishment || null,
        oneSentenceSummary: extractedData.oneSentenceSummary || null,
        legalDesignation: extractedData.legalDesignation || null,
        primaryCauseAreas: extractedData.primaryCauseAreas || [],
        populations: extractedData.populations || [],
        geographicalFocus: extractedData.geographicalFocus || null,
      },
      create: {
        userId: user.userId,
        fileName: fileName || null,
        s3Key: s3Key || null,
        s3Url: s3Url || null,
        organizationName: extractedData.organizationName || null,
        ein: extractedData.ein || null,
        missionStatement: extractedData.missionStatement || null,
        yearFounded: extractedData.yearFounded || null,
        locationServed: extractedData.locationServed || null,
        biggestAccomplishment: extractedData.biggestAccomplishment || null,
        oneSentenceSummary: extractedData.oneSentenceSummary || null,
        legalDesignation: extractedData.legalDesignation || null,
        primaryCauseAreas: extractedData.primaryCauseAreas || [],
        populations: extractedData.populations || [],
        geographicalFocus: extractedData.geographicalFocus || null,
      },
    });

    return NextResponse.json({
      success: true,
      profile: profile,
    });

  } catch (error) {
    console.error('Error in profile extract route:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to extract profile data: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while extracting profile data.' },
      { status: 500 }
    );
  }
}

