// BACKEND: S3 utility functions
// Upload, retrieve, and delete files from AWS S3

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';

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
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured');
  }

  // Sanitize key: remove spaces and special characters
  const sanitizedKey = key.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const uniqueKey = `proposals/${timestamp}_${sanitizedKey}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: uniqueKey,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Generate URL (public bucket) or signed URL (private bucket)
  const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${uniqueKey}`;

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
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured');
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
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
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured');
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
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
    process.env.AWS_REGION &&
    process.env.AWS_S3_BUCKET_NAME
  );
}

