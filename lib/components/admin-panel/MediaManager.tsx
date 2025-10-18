'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import {
  Upload,
  Search,
  Trash2,
  Download,
  Image as ImageIcon,
  File,
  Video,
  FileText,
  Folder,
  FolderPlus,
  Grid,
  List,
  CheckSquare,
  Square,
  HardDrive
} from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document' | 'other';
  size: number;
  folder: string | null;
  uploadedAt: string;
  uploadedBy: {
    id: string;
    name: string;
  };
}

export function MediaManager() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [folderFilter, setFolderFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  useEffect(() => {
    loadMedia();
  }, [typeFilter, folderFilter]);

  const loadMedia = async () => {
    // Simulated data for now - would connect to API
    setIsLoading(true);
    try {
      // Mock data
      const mockFiles: MediaFile[] = [
        {
          id: '1',
          name: 'product-image-1.jpg',
          url: 'https://via.placeholder.com/300',
          type: 'image',
          size: 245000,
          folder: 'products',
          uploadedAt: new Date().toISOString(),
          uploadedBy: { id: '1', name: 'Admin User' }
        },
        {
          id: '2',
          name: 'homestay-photo.jpg',
          url: 'https://via.placeholder.com/300',
          type: 'image',
          size: 345000,
          folder: 'homestays',
          uploadedAt: new Date().toISOString(),
          uploadedBy: { id: '1', name: 'Admin User' }
        },
        {
          id: '3',
          name: 'village-video.mp4',
          url: '#',
          type: 'video',
          size: 5245000,
          folder: 'videos',
          uploadedAt: new Date().toISOString(),
          uploadedBy: { id: '1', name: 'Admin User' }
        },
        {
          id: '4',
          name: 'terms-conditions.pdf',
          url: '#',
          type: 'document',
          size: 145000,
          folder: 'documents',
          uploadedAt: new Date().toISOString(),
          uploadedBy: { id: '1', name: 'Admin User' }
        }
      ];
      setFiles(mockFiles);
    } catch (error) {
      console.error('Failed to load media:', error);
      setError('Failed to load media files');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || file.type === typeFilter;
    const matchesFolder = folderFilter === 'all' || file.folder === folderFilter;
    return matchesSearch && matchesType && matchesFolder;
  });

  const folders = Array.from(new Set(files.filter(f => f.folder).map(f => f.folder))) as string[];

  const stats = {
    total: files.length,
    images: files.filter(f => f.type === 'image').length,
    videos: files.filter(f => f.type === 'video').length,
    documents: files.filter(f => f.type === 'document').length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0),
    storageLimit: 10 * 1024 * 1024 * 1024, // 10GB
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const toggleSelectFile = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const selectAllFiles = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredFiles.map(f => f.id)));
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }
    // Would call API here
    setFiles(files.filter(f => f.id !== fileId));
  };

  const bulkDeleteFiles = async () => {
    if (selectedFiles.size === 0) {
      alert('Please select files to delete');
      return;
    }
    if (!confirm(`Are you sure you want to delete ${selectedFiles.size} file(s)?`)) {
      return;
    }
    // Would call API here
    setFiles(files.filter(f => !selectedFiles.has(f.id)));
    setSelectedFiles(new Set());
  };

  const downloadFile = (file: MediaFile) => {
    window.open(file.url, '_blank');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-6 w-6 text-blue-500" />;
      case 'video':
        return <Video className="h-6 w-6 text-purple-500" />;
      case 'document':
        return <FileText className="h-6 w-6 text-orange-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const storagePercent = (stats.totalSize / stats.storageLimit) * 100;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading media...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Media Manager</h2>
          <p className="text-gray-600">Upload and manage media files</p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedFiles.size > 0 && (
            <Button
             
              size="sm"
              onClick={bulkDeleteFiles}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete {selectedFiles.size}
            </Button>
          )}
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <File className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Images</p>
                <p className="text-2xl font-bold text-blue-600">{stats.images}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Videos</p>
                <p className="text-2xl font-bold text-purple-600">{stats.videos}</p>
              </div>
              <Video className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Documents</p>
                <p className="text-2xl font-bold text-orange-600">{stats.documents}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Storage</p>
                <p className="text-2xl font-bold text-green-600">{storagePercent.toFixed(1)}%</p>
              </div>
              <HardDrive className="h-8 w-8 text-green-400" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${Math.min(storagePercent, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatSize(stats.totalSize)} of {formatSize(stats.storageLimit)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>

            <select
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Folders</option>
              {folders.map(folder => (
                <option key={folder} value={folder}>{folder}</option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              {filteredFiles.length > 0 && (
                <button
                  onClick={selectAllFiles}
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700 px-3 py-2 border border-gray-300 rounded-md"
                >
                  {selectedFiles.size === filteredFiles.length ? (
                    <CheckSquare className="h-4 w-4 mr-1" />
                  ) : (
                    <Square className="h-4 w-4 mr-1" />
                  )}
                  {selectedFiles.size === filteredFiles.length ? 'Deselect' : 'Select All'}
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
               
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-primary-100' : ''}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
               
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-primary-100' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="relative group">
              <CardContent className="p-3">
                <div className="absolute top-2 left-2 z-10">
                  <button onClick={() => toggleSelectFile(file.id)}>
                    {selectedFiles.has(file.id) ? (
                      <CheckSquare className="h-5 w-5 text-primary-600 bg-white rounded" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400 bg-white rounded" />
                    )}
                  </button>
                </div>

                <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                  {file.type === 'image' ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    getFileIcon(file.type)
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                  {file.folder && (
                    <Badge className="text-xs">
                      <Folder className="h-3 w-3 mr-1" />
                      {file.folder}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-1 mt-2">
                  <Button
                   
                    size="sm"
                    onClick={() => downloadFile(file)}
                    className="flex-1"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                   
                    size="sm"
                    onClick={() => deleteFile(file.id)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="py-3 px-4 w-12">
                      <button onClick={selectAllFiles}>
                        {selectedFiles.size === filteredFiles.length && filteredFiles.length > 0 ? (
                          <CheckSquare className="h-5 w-5 text-primary-600" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Size</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Folder</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Uploaded</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50 border-b">
                      <td className="py-3 px-4">
                        <button onClick={() => toggleSelectFile(file.id)}>
                          {selectedFiles.has(file.id) ? (
                            <CheckSquare className="h-5 w-5 text-primary-600" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {file.type === 'image' ? (
                            <img src={file.url} alt={file.name} className="w-10 h-10 rounded object-cover mr-3" />
                          ) : (
                            <div className="mr-3">{getFileIcon(file.type)}</div>
                          )}
                          <span className="font-medium text-gray-900">{file.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="capitalize">
                          {file.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatSize(file.size)}</td>
                      <td className="py-3 px-4">
                        {file.folder && (
                          <Badge>
                            <Folder className="h-3 w-3 mr-1" />
                            {file.folder}
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                           
                            size="sm"
                            onClick={() => downloadFile(file)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                           
                            size="sm"
                            onClick={() => deleteFile(file.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredFiles.length === 0 && !error && (
        <Card>
          <CardContent className="text-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || typeFilter !== 'all' || folderFilter !== 'all'
                ? 'No files match your filter criteria'
                : 'Upload your first file to get started'}
            </p>
            <Button onClick={() => setShowUploadModal(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload Modal Placeholder */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop files here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => {
                    if (e.target.files) {
                      alert(`Selected ${e.target.files.length} file(s) - Upload functionality would be implemented here`);
                      setShowUploadModal(false);
                    }
                  }}
                />
                <label htmlFor="file-upload" className="inline-block">
                  <span className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 cursor-pointer">
                    Choose Files
                  </span>
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
