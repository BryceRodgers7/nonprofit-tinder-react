// BACKEND: File upload API route
// Handles file upload, text extraction, and S3 storage for proposal documents

import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { uploadFileToS3, validateS3Config } from '@/lib/s3';

// Simple PDF parsing function using the stable pdf-parse library (v1.1.1)
async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    // Import the core implementation directly to avoid test helpers in index.js
    const pdfParseModule = await import('pdf-parse/lib/pdf-parse.js');
    const pdfParseFn = pdfParseModule.default || pdfParseModule;
    const data = await pdfParseFn(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file');
  }
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = file.type;
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    const validExtensions = ['pdf', 'docx', 'txt'];
    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOCX, and TXT files are allowed.' },
        { status: 400 }
      );
    }

    // Extract text based on file type
    let extractedText = '';
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    try {
      if (fileExtension === 'pdf') {
        extractedText = await parsePDF(fileBuffer);
      } else if (fileExtension === 'docx') {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        extractedText = result.value;
      } else if (fileExtension === 'txt') {
        extractedText = fileBuffer.toString('utf-8');
      }
    } catch (parseError) {
      console.error('Error parsing file:', parseError);
      return NextResponse.json(
        { error: 'Failed to extract text from file. Please ensure the file is not corrupted.' },
        { status: 500 }
      );
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'No text could be extracted from the file.' },
        { status: 400 }
      );
    }

    // Upload file to S3 (if configured)
    let s3Key: string | undefined;
    let s3Url: string | undefined;
    let s3Error: string | undefined;

    console.log('S3 Configuration Status:', {
      isConfigured: validateS3Config(),
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
      hasRegion: !!process.env.AWS_REGION,
      hasBucket: !!process.env.AWS_S3_BUCKET_NAME,
    });

    if (validateS3Config()) {
      try {
        console.log('Attempting S3 upload for file:', fileName);
        const s3Result = await uploadFileToS3(fileBuffer, fileName, file.type);
        s3Key = s3Result.key;
        s3Url = s3Result.url;
        console.log('S3 upload successful:', { s3Key, s3Url });
      } catch (s3UploadError) {
        console.error('S3 upload error:', s3UploadError);
        s3Error = s3UploadError instanceof Error ? s3UploadError.message : 'Unknown S3 error';
        // Continue without S3 - don't fail the entire request
      }
    } else {
      console.warn('S3 is not configured. File will not be stored in S3.');
      s3Error = 'S3 is not configured. Check AWS environment variables.';
    }

    return NextResponse.json({
      success: true,
      fileName: fileName,
      fileType: fileExtension,
      extractedText: extractedText,
      s3Key,
      s3Url,
      s3Error,
      s3Configured: validateS3Config(),
    });

  } catch (error) {
    console.error('Error in upload route:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the file.' },
      { status: 500 }
    );
  }
}

