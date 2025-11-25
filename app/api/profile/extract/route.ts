// BACKEND: Profile extraction API route
// Uses GPT to extract non-profit organization data from proposal documents

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { requireAuth } from '@/lib/middleware';
import { 
  PRIMARY_CAUSE_AREAS, 
  POPULATIONS, 
  GEOGRAPHIC_FOCUS_OPTIONS, 
  LEGAL_DESIGNATION_OPTIONS 
} from '@/lib/profile-constants';

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
- legalDesignation: Select one legal designation from this EXACT list: ${LEGAL_DESIGNATION_OPTIONS.join(', ')}. Match the text as closely as possible. Common variations: "501c3" or "501(c)3" should map to "501(c)(3) – Public Charity" or "501(c)(3) – Private Foundation" based on context.
- primaryCauseAreas: Array of primary cause areas. Select one or more from this EXACT list: ${PRIMARY_CAUSE_AREAS.join(', ')}. Match the text as closely as possible. Use "Other" if none match.
- populations: Array of populations served. Select one or more from this EXACT list: ${POPULATIONS.join(', ')}. Match the text as closely as possible. Use "Other" if none match.
- geographicalFocus: Select one geographical focus from this EXACT list: ${GEOGRAPHIC_FOCUS_OPTIONS.join(', ')}. Match the text as closely as possible.

IMPORTANT: For legalDesignation, primaryCauseAreas, populations, and geographicalFocus, you MUST use values from the provided lists above. This ensures the extracted data matches the dropdown options in the form.

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

    // Return extracted data WITHOUT saving to database
    // The user will review and manually click "Save Profile" to persist changes
    return NextResponse.json({
      success: true,
      extractedData: {
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

