import { useState } from "react";
import { useToast } from "./useToast";

interface UploadProgress {
  loaded: number;
  total: number;
}

interface UploadResponse {
  success: boolean;
  uploadURL?: string;
  filename?: string;
  s3Key?: string;
  message?: string;
}

interface CompleteUploadResponse {
  success: boolean;
  file?: {
    name: string;
    s3Key: string;
    url: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
  };
  message?: string;
}

/**
 * Custom hook for handling AWS S3 file uploads with pre-signed URLs
 *
 * Usage:
 * const { uploadFile, isUploading, progress } = useFileUpload();
 *
 * // In your component
 * const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (file) {
 *     const result = await uploadFile(file);
 *     if (result.success) {
 *       console.log("File uploaded:", result.fileUrl);
 *     }
 *   }
 * };
 */
export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({ loaded: 0, total: 0 });
  const { success, error } = useToast();

  /**
   * Upload a file to S3 using pre-signed URL
   * @param file - The file to upload
   * @returns Object with success status and file URL
   */
  const uploadFile = async (file: File): Promise<{
    success: boolean;
    fileUrl?: string;
    s3Key?: string;
    message?: string;
  }> => {
    try {
      setIsUploading(true);
      setProgress({ loaded: 0, total: file.size });

      // Step 1: Request pre-signed URL from backend
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      const uploadData: UploadResponse = await uploadResponse.json();

      if (!uploadData.success || !uploadData.uploadURL) {
        error(uploadData.message || "Failed to get upload URL");
        return { success: false, message: uploadData.message };
      }

      // Step 2: Upload file directly to S3 using pre-signed URL
      const s3Response = await fetch(uploadData.uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!s3Response.ok) {
        error("Failed to upload file to S3");
        return { success: false, message: "S3 upload failed" };
      }

      setProgress({ loaded: file.size, total: file.size });

      // Step 3: Notify backend of successful upload
      const completeResponse = await fetch("/api/upload-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          s3Key: uploadData.filename,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      const completeData: CompleteUploadResponse = await completeResponse.json();

      if (!completeData.success) {
        error("Failed to complete upload");
        return { success: false, message: completeData.message };
      }

      success(`File "${file.name}" uploaded successfully!`);
      return {
        success: true,
        fileUrl: completeData.file?.url,
        s3Key: completeData.file?.s3Key,
        message: completeData.message,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      error(`Upload failed: ${errorMessage}`);
      return { success: false, message: errorMessage };
    } finally {
      setIsUploading(false);
      setProgress({ loaded: 0, total: 0 });
    }
  };

  /**
   * Get upload progress percentage
   */
  const progressPercentage = progress.total > 0
    ? Math.round((progress.loaded / progress.total) * 100)
    : 0;

  return {
    uploadFile,
    isUploading,
    progress,
    progressPercentage,
  };
}
