import { NextResponse } from "next/server";
import {
  generateUploadPresignedUrl,
  validateFile,
  generateUniqueFilename,
} from "@/lib/s3";

/**
 * POST /api/upload
 * Generates a pre-signed URL for client-side file uploads to S3
 *
 * Request body:
 * {
 *   filename: string (original filename)
 *   fileType: string (MIME type, e.g., "image/png")
 *   fileSize: number (in bytes)
 * }
 *
 * Response:
 * {
 *   success: boolean
 *   uploadURL?: string (pre-signed URL for direct upload)
 *   filename?: string (S3 key where file will be stored)
 *   message?: string (error message if unsuccessful)
 * }
 */
export async function POST(req: Request) {
  try {
    const { filename, fileType, fileSize } = await req.json();

    // Validate input
    if (!filename || !fileType || fileSize === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: filename, fileType, fileSize",
        },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(fileType, fileSize);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: validation.message,
        },
        { status: 400 }
      );
    }

    // Generate unique filename to prevent collisions
    const uniqueFilename = generateUniqueFilename(filename);

    // Generate pre-signed URL (expires in 60 seconds)
    const uploadURL = await generateUploadPresignedUrl(uniqueFilename, fileType, 60);

    return NextResponse.json(
      {
        success: true,
        uploadURL,
        filename: uniqueFilename, // Return S3 key to store in database
        message: "Pre-signed URL generated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload URL generation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate pre-signed URL",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
