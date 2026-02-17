import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client with credentials from environment
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Generate a pre-signed URL for uploading a file to S3
 * @param filename - Name of the file to upload
 * @param fileType - MIME type of the file
 * @param expiresIn - URL expiry time in seconds (default: 60)
 * @returns Pre-signed URL for direct upload
 */
export async function generateUploadPresignedUrl(
  filename: string,
  fileType: string,
  expiresIn: number = 60
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: filename,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error("Error generating upload URL:", error);
    throw new Error("Failed to generate pre-signed upload URL");
  }
}

/**
 * Generate a pre-signed URL for downloading/viewing a file from S3
 * @param filename - Name of the file to retrieve
 * @param expiresIn - URL expiry time in seconds (default: 3600 = 1 hour)
 * @returns Pre-signed URL for file access
 */
export async function generateDownloadPresignedUrl(
  filename: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: filename,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error("Error generating download URL:", error);
    throw new Error("Failed to generate pre-signed download URL");
  }
}

/**
 * Delete a file from S3
 * @param filename - Name of the file to delete
 */
export async function deleteS3Object(filename: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: filename,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting S3 object:", error);
    throw new Error("Failed to delete file from S3");
  }
}

/**
 * Validate file for upload
 * @param fileType - MIME type of the file
 * @param fileSize - Size of the file in bytes
 * @returns Object with validation result and error message if invalid
 */
export function validateFile(
  fileType: string,
  fileSize: number
): { valid: boolean; message?: string } {
  // Allowed file types
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  // Max file size: 50MB
  const maxFileSize = 50 * 1024 * 1024;

  if (!allowedTypes.includes(fileType)) {
    return {
      valid: false,
      message: `File type not allowed. Allowed types: Images (JPEG, PNG, GIF, WebP), PDF, and Office documents`,
    };
  }

  if (fileSize > maxFileSize) {
    return {
      valid: false,
      message: `File size exceeds 50MB limit. Your file: ${(fileSize / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  return { valid: true };
}

/**
 * Generate a unique filename with timestamp to prevent collisions
 * @param originalFilename - Original name of the file
 * @returns Unique filename with timestamp
 */
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalFilename.substring(originalFilename.lastIndexOf("."));
  return `uploads/${timestamp}-${random}${extension}`;
}
