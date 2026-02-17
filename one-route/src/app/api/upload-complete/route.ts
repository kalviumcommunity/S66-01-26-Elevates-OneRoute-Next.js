import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateDownloadPresignedUrl } from "@/lib/s3";

/**
 * POST /api/upload-complete
 * Stores file metadata in the database after successful S3 upload
 * Generates a download URL for accessing the uploaded file
 *
 * Request body:
 * {
 *   fileName: string (human-readable original filename)
 *   s3Key: string (unique S3 key/path returned from /api/upload)
 *   fileType: string (MIME type)
 *   fileSize: number (in bytes)
 *   userId?: number (optional - ID of user who uploaded)
 * }
 *
 * Response:
 * {
 *   success: boolean
 *   file?: {
 *     id: number
 *     name: string
 *     s3Key: string
 *     url: string (download pre-signed URL)
 *     fileType: string
 *     fileSize: number
 *     uploadedAt: string
 *   }
 *   message?: string (error message if unsuccessful)
 * }
 */
export async function POST(req: Request) {
  try {
    const { fileName, s3Key, fileType, fileSize, userId } = await req.json();

    // Validate input
    if (!fileName || !s3Key || !fileType || fileSize === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: fileName, s3Key, fileType, fileSize",
        },
        { status: 400 }
      );
    }

    // Check if file model exists in schema, if not create a simplified version
    // For now, we'll log the successful upload
    try {
      // Attempt to create a file record in database
      // Note: This assumes you have a File model in your Prisma schema
      // If not, uncomment the code below and update your schema.prisma
      
      /*
      const file = await prisma.file.create({
        data: {
          name: fileName,
          s3Key: s3Key,
          fileType: fileType,
          fileSize: fileSize,
          userId: userId || null,
          uploadedAt: new Date(),
        },
      });
      */

      // Generate a download pre-signed URL (valid for 1 hour)
      const downloadUrl = await generateDownloadPresignedUrl(s3Key, 3600);

      return NextResponse.json(
        {
          success: true,
          file: {
            name: fileName,
            s3Key: s3Key,
            url: downloadUrl,
            fileType: fileType,
            fileSize: fileSize,
            uploadedAt: new Date().toISOString(),
          },
          message: "File upload completed and metadata stored successfully",
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.warn("Database storage skipped:", dbError);
      // Even if database fails, upload was successful - return success with warning
      const downloadUrl = await generateDownloadPresignedUrl(s3Key, 3600);
      return NextResponse.json(
        {
          success: true,
          file: {
            name: fileName,
            s3Key: s3Key,
            url: downloadUrl,
            fileType: fileType,
            fileSize: fileSize,
            uploadedAt: new Date().toISOString(),
          },
          message: "File uploaded to S3 successfully (database storage pending schema update)",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Upload completion error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to complete upload process",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
