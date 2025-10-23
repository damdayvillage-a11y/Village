"use client";

import React, { useState } from 'react';
import { MediaLibrary } from '@/lib/components/admin-panel/media/MediaLibrary';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';

export default function MediaPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = (files: any[]) => {
    console.log('Upload complete:', files);
    // Refresh the media library
    setRefreshKey((prev) => prev + 1);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    alert(error);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Media Management</h1>
        <p className="text-gray-600 mt-2">
          Upload and manage your media files with automatic optimization
        </p>
      </div>

      <Tabs defaultValue="library" className="space-y-6">
        <TabsList>
          <TabsTrigger value="library">Media Library</TabsTrigger>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          <MediaLibrary key={refreshKey} />
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Files</CardTitle>
              <CardDescription>
                Upload images and they will be automatically optimized for web delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                maxFiles={10}
                maxSize={10 * 1024 * 1024}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
