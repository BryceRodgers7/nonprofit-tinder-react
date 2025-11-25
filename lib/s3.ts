// BACKEND: S3 utility functions
// Upload, retrieve, and delete files from AWS S3

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
console.log('[S3 Init] Initializing S3 client with region:', process.env.AWS_DEFAULT_REGION || 'us-east-1');
console.log('[S3 Init] Has Access Key:', !!process.env.AWS_ACCESS_KEY_ID);
console.log('[S3 Init] Has Secret Key:', !!process.env.AWS_SECRET_ACCESS_KEY);
console.log('[S3 Init] Bucket Name:', process.env.AWS_BUCKET);

const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const AWS_BUCKET = process.env.AWS_BUCKET || '';

/**
 * Upload a file to S3
 * @param file - File buffer
 * @param key - S3 object key (filename)
 * @param contentType - MIME type
 * @returns S3 key and URL
 */
export async function uploadFileToS3(
  file: Buffer,
  key: string,
  contentType: string
): Promise<{ key: string; url: string }> {
  console.log('[S3] Starting upload process...');
  console.log('[S3] Bucket:', AWS_BUCKET);
  console.log('[S3] Region:', process.env.AWS_DEFAULT_REGION);
  console.log('[S3] Original key:', key);
  console.log('[S3] Content type:', contentType);
  console.log('[S3] File size:', file.length, 'bytes');

  if (!AWS_BUCKET) {
    throw new Error('AWS_S3_AWS_BUCKET is not configured');
  }

  // Sanitize key: remove spaces and special characters
  const sanitizedKey = key.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const uniqueKey = `proposals/${timestamp}_${sanitizedKey}`;

  console.log('[S3] Sanitized unique key:', uniqueKey);

  const command = new PutObjectCommand({
    Bucket: AWS_BUCKET,
    Key: uniqueKey,
    Body: file,
    ContentType: contentType,
  });

  try {
    console.log('[S3] Sending PutObjectCommand...');
    const result = await s3Client.send(command);
    console.log('[S3] Upload successful! ETag:', result.ETag);
  } catch (uploadError) {
    console.error('[S3] Upload failed:', uploadError);
    throw uploadError;
  }

  // Generate URL (public bucket) or signed URL (private bucket)
  const url = `https://${AWS_BUCKET}.s3.${process.env.AWS_DEFAULT_REGION || 'us-east-1'}.amazonaws.com/${uniqueKey}`;
  console.log('[S3] Generated URL:', url);

  return {
    key: uniqueKey,
    url,
  };
}

/**
 * Generate a signed URL for accessing a private S3 object
 * @param key - S3 object key
 * @param expiresIn - URL expiration in seconds (default: 1 hour)
 * @returns Signed URL
 */
export async function getSignedS3Url(key: string, expiresIn: number = 3600): Promise<string> {
  if (!AWS_BUCKET) {
    throw new Error('AWS_S3_AWS_BUCKET is not configured');
  }

  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return signedUrl;
}

/**
 * Delete a file from S3
 * @param key - S3 object key
 */
export async function deleteFileFromS3(key: string): Promise<void> {
  if (!AWS_BUCKET) {
    throw new Error('AWS_S3_AWS_BUCKET is not configured');
  }

  const command = new DeleteObjectCommand({
    Bucket: AWS_BUCKET,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Validate S3 configuration
 */
export function validateS3Config(): boolean {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_DEFAULT_REGION &&
    process.env.AWS_BUCKET
  );
}

