import React, { useRef, useState } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";

interface FileUploadInputProps {
  onFileUpload?: (fileUrl: string, s3Key: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  isLoading?: boolean;
}

/**
 * Reusable File Upload Component
 *
 * Example usage:
 * <FileUploadInput
 *   accept="image/*,.pdf"
 *   onFileUpload={(url, key) => console.log("Uploaded:", url)}
 * />
 */
export function FileUploadInput({
  onFileUpload,
  accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx",
  maxSize = 50,
  isLoading = false,
}: FileUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadFile, isUploading, progressPercentage } = useFileUpload();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      alert(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const result = await uploadFile(selectedFile);
    if (result.success && result.fileUrl && result.s3Key) {
      onFileUpload?.(result.fileUrl, result.s3Key);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={isUploading || isLoading}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer disabled:opacity-50"
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading || isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-600 transition"
        >
          {isUploading ? `Uploading... ${progressPercentage}%` : "Upload"}
        </button>
      </div>

      {selectedFile && !isUploading && (
        <p className="mt-2 text-sm text-gray-600">
          Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}

      {isUploading && (
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
