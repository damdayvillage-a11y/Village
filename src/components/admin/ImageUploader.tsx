"use client";

/**
 * Image Uploader Component
 * Drag & drop interface for uploading images with validation and preview
 */

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent } from '@/lib/components/ui/Card';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface ImageUploaderProps {
  onUploadComplete?: (files: any[]) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  folder?: string;
  accept?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  folder,
  accept = 'image/*',
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map((f) => f.errors[0]?.message).join(', ');
        if (onUploadError) {
          onUploadError(errors);
        }
        return;
      }

      // Add accepted files to state
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
        progress: 0,
      }));

      setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));
    },
    [maxFiles, onUploadError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
    },
    maxSize,
    maxFiles,
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);

    const formData = new FormData();
    files.forEach((f) => {
      formData.append('files', f.file);
    });
    if (folder) {
      formData.append('folder', folder);
    }

    try {
      // Update status to uploading
      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: 'uploading' as const, progress: 50 }))
      );

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Update status to success
      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: 'success' as const, progress: 100 }))
      );

      if (onUploadComplete) {
        onUploadComplete(data.files || []);
      }

      // Clear files after successful upload
      setTimeout(() => {
        setFiles([]);
      }, 2000);
    } catch (error) {
      // Update status to error
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          status: 'error' as const,
          error: 'Upload failed',
        }))
      );

      if (onUploadError) {
        onUploadError('Failed to upload files. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-full">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              {isDragActive ? 'Drop files here' : 'Drag & drop images here'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse (max {maxFiles} files, {formatFileSize(maxSize)} each)
            </p>
          </div>
        </div>
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <Card key={file.id} className="relative">
                <CardContent className="p-3">
                  {/* Preview image */}
                  <div className="aspect-square bg-gray-100 rounded-md mb-2 overflow-hidden relative">
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Status overlay */}
                    {file.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                      </div>
                    )}
                    {file.status === 'success' && (
                      <div className="absolute inset-0 bg-green-500 bg-opacity-75 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                    )}
                    {file.status === 'error' && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>

                  {/* File info */}
                  <p className="text-sm font-medium truncate" title={file.file.name}>
                    {file.file.name}
                  </p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.file.size)}</p>

                  {/* Remove button */}
                  {file.status === 'pending' && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upload button */}
          {files.some((f) => f.status === 'pending') && (
            <div className="flex justify-end">
              <Button onClick={uploadFiles} disabled={uploading} size="lg">
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {files.filter((f) => f.status === 'pending').length} file(s)
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
