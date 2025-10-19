"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Trash2, Download, Eye, Search, Loader2, Image as ImageIcon } from 'lucide-react';

interface MediaFile {
  id: string;
  url: string;
  thumbnailUrl?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
}

interface MediaLibraryProps {
  key?: number;
}

export function MediaLibrary({ key }: MediaLibraryProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  useEffect(() => {
    fetchMedia();
  }, [key]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/media');
      if (response.ok) {
        const data = await response.json();
        setFiles(data.media || []);
      } else {
        console.error('Failed to fetch media');
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchMedia();
        if (selectedFile?.id === id) {
          setSelectedFile(null);
        }
      } else {
        alert('Failed to delete file');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete file');
    }
  };

  const handleDownload = (file: MediaFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const filteredFiles = files.filter((file) =>
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No media files</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading your first image or video.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* File Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              {/* Image Preview */}
              <div 
                className="aspect-square overflow-hidden bg-gray-100 cursor-pointer relative"
                onClick={() => setSelectedFile(file)}
              >
                {file.mimeType.startsWith('image/') ? (
                  <img
                    src={file.thumbnailUrl || file.url}
                    alt={file.originalName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(file);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* File Info */}
              <div className="p-3 space-y-2">
                <p className="text-xs truncate text-gray-900 font-medium" title={file.originalName}>
                  {file.originalName}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatFileSize(file.size)}</span>
                  {file.width && file.height && (
                    <span>{file.width}×{file.height}</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 pt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyUrl(file.url)}
                    className="flex-1 h-8 text-xs"
                    title="Copy URL"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownload(file)}
                    className="flex-1 h-8 text-xs"
                    title="Download"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(file.id)}
                    className="flex-1 h-8 text-xs text-red-600 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="text-gray-500">No files match your search.</p>
        </div>
      )}

      {/* File Details Modal */}
      {selectedFile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedFile(null)}
        >
          <Card 
            className="max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Preview */}
                <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
                  {selectedFile.mimeType.startsWith('image/') ? (
                    <img
                      src={selectedFile.url}
                      alt={selectedFile.originalName}
                      className="max-w-full max-h-[500px] object-contain"
                    />
                  ) : (
                    <ImageIcon className="h-24 w-24 text-gray-400" />
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">File Details</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <p className="text-gray-900 break-all">{selectedFile.originalName}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">Size:</span>
                      <p className="text-gray-900">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    
                    {selectedFile.width && selectedFile.height && (
                      <div>
                        <span className="font-medium text-gray-700">Dimensions:</span>
                        <p className="text-gray-900">{selectedFile.width} × {selectedFile.height} px</p>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>
                      <p className="text-gray-900">{selectedFile.mimeType}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">URL:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 overflow-auto">
                          {selectedFile.url}
                        </code>
                        <Button
                          size="sm"
                          onClick={() => handleCopyUrl(selectedFile.url)}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">Uploaded:</span>
                      <p className="text-gray-900">
                        {new Date(selectedFile.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => handleDownload(selectedFile)}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleDelete(selectedFile.id);
                      }}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setSelectedFile(null)}
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
