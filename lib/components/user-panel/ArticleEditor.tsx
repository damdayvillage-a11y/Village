'use client';

import { useState } from 'react';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import { 
  FileText, 
  PlusCircle, 
  Edit2, 
  Eye, 
  Save, 
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'review';
  publishedAt?: string;
  views?: number;
  content?: string;
}

interface ArticleEditorProps {
  articles: Article[];
  onSubmit: (data: {
    title: string;
    content: string;
    status: 'draft' | 'published' | 'review';
  }) => void;
  onUpdate: (id: string, data: {
    title: string;
    content: string;
    status: 'draft' | 'published' | 'review';
  }) => void;
  onDelete: (id: string) => void;
}

export function ArticleEditor({ articles, onSubmit, onUpdate, onDelete }: ArticleEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft' as 'draft' | 'published' | 'review'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingArticle) {
        await onUpdate(editingArticle.id, formData);
      } else {
        await onSubmit(formData);
      }
      
      resetForm();
    } catch (error) {
      console.error('Failed to save article:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      status: 'draft'
    });
    setIsEditing(false);
    setEditingArticle(null);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content || '',
      status: article.status
    });
    setIsEditing(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-4 w-4" />;
      case 'review':
        return <AlertCircle className="h-4 w-4" />;
      case 'published':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Articles</h2>
          <p className="text-gray-600">Write and manage your articles</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsEditing(true)}
          icon={<PlusCircle className="h-4 w-4" />}
        >
          New Article
        </Button>
      </div>

      {/* Article Editor Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingArticle ? 'Edit Article' : 'Write New Article'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Article Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter your article title..."
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your article content here..."
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-vertical"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can use markdown formatting in your content.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'review' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="draft">Draft (Save for later)</option>
                  <option value="review">Submit for Review</option>
                  <option value="published">Publish Now</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.status === 'draft' && 'Save as draft to continue editing later'}
                  {formData.status === 'review' && 'Submit for admin review before publishing'}
                  {formData.status === 'published' && 'Publish immediately (visible to all users)'}
                </p>
              </div>

              <div className="flex space-x-3">
                <Button 
                  type="submit" 
                  variant="primary" 
                  loading={isSubmitting}
                  icon={<Save className="h-4 w-4" />}
                >
                  {editingArticle ? 'Update Article' : 'Save Article'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Articles List */}
      <div className="space-y-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Card key={article.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {article.publishedAt && (
                        <span>Published: {new Date(article.publishedAt).toLocaleDateString()}</span>
                      )}
                      {article.views !== undefined && (
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {article.views} views
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(article.status)}>
                      {getStatusIcon(article.status)}
                      <span className="ml-1">{article.status}</span>
                    </Badge>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(article)}
                    icon={<Edit2 className="h-4 w-4" />}
                  >
                    Edit
                  </Button>
                  {article.status === 'published' && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye className="h-4 w-4" />}
                    >
                      View
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this article?')) {
                        onDelete(article.id);
                      }
                    }}
                    icon={<Trash2 className="h-4 w-4" />}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No articles yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start writing your first article to share with the community
              </p>
              <Button 
                variant="primary" 
                onClick={() => setIsEditing(true)}
                icon={<PlusCircle className="h-4 w-4" />}
              >
                Write Your First Article
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}