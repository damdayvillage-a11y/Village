'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import { Avatar } from '@/lib/components/ui/Avatar';
import { 
  MessageSquare,
  Star,
  Trash2,
  AlertCircle,
  CheckSquare,
  Square,
  Mail,
  Reply,
  MoreVertical,
  Download
} from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  homestay: {
    id: string;
    name: string;
    owner: {
      id: string;
      name: string;
    };
  } | null;
}

export function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [selectedReviews, setSelectedReviews] = useState<Set<string>>(new Set());
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseReview, setResponseReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const responseTemplates = [
    {
      name: 'Thank You',
      text: 'Thank you for your valuable feedback! We appreciate your time and insights.'
    },
    {
      name: 'Apology',
      text: 'We sincerely apologize for any inconvenience. We are taking steps to address your concerns immediately.'
    },
    {
      name: 'Investigation',
      text: 'Thank you for bringing this to our attention. We are currently investigating the matter and will get back to you soon.'
    },
    {
      name: 'Resolved',
      text: 'We are glad to inform you that the issue has been resolved. Please feel free to reach out if you have any further concerns.'
    },
  ];

  const loadReviews = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (ratingFilter !== 'all') {
        params.append('rating', ratingFilter);
      }
      params.append('hasComment', 'true'); // Only show reviews with comments

      const response = await fetch(`/api/admin/reviews?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load reviews');
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setError('Network error loading reviews');
    } finally {
      setIsLoading(false);
    }
  }, [ratingFilter]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`/api/admin/reviews?id=${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadReviews();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('Network error deleting review');
    }
  };

  const toggleSelectReview = (reviewId: string) => {
    const newSelected = new Set(selectedReviews);
    if (newSelected.has(reviewId)) {
      newSelected.delete(reviewId);
    } else {
      newSelected.add(reviewId);
    }
    setSelectedReviews(newSelected);
  };

  const selectAllReviews = () => {
    if (selectedReviews.size === reviews.length) {
      setSelectedReviews(new Set());
    } else {
      setSelectedReviews(new Set(reviews.map(r => r.id)));
    }
  };

  const bulkDeleteReviews = async () => {
    if (selectedReviews.size === 0) {
      alert('Please select reviews to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedReviews.size} review(s)?`)) {
      return;
    }

    try {
      const deletePromises = Array.from(selectedReviews).map(reviewId =>
        fetch(`/api/admin/reviews?id=${reviewId}`, {
          method: 'DELETE',
        })
      );

      await Promise.all(deletePromises);
      setSelectedReviews(new Set());
      await loadReviews();
    } catch (error) {
      console.error('Failed to delete reviews:', error);
      alert('Network error deleting reviews');
    }
  };

  const exportReviews = () => {
    const csvData = reviews.map(review => ({
      'Review ID': review.id,
      'User Name': review.user.name,
      'User Email': review.user.email,
      'Rating': review.rating,
      'Comment': review.comment || 'N/A',
      'Homestay': review.homestay?.name || 'General',
      'Owner': review.homestay?.owner.name || 'N/A',
      'Date': new Date(review.createdAt).toLocaleString(),
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row =>
        headers.map(header => {
          const value = row[header as keyof typeof row];
          return typeof value === 'string' && value.includes(',')
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reviews_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openResponseModal = (review: Review) => {
    setResponseReview(review);
    setResponseText('');
    setShowTemplates(false);
    setShowResponseModal(true);
  };

  const sendResponse = async () => {
    if (!responseText.trim()) {
      alert('Please enter a response message');
      return;
    }

    // In a real implementation, this would send an email via an API
    // For now, we'll simulate it
    try {
      alert(`Response sent to ${responseReview?.user.name} (${responseReview?.user.email}):\n\n${responseText}`);
      setShowResponseModal(false);
      setResponseReview(null);
      setResponseText('');
    } catch (error) {
      console.error('Failed to send response:', error);
      alert('Network error sending response');
    }
  };

  const applyTemplate = (template: { name: string; text: string }) => {
    setResponseText(template.text);
    setShowTemplates(false);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reviews & Complaints</h2>
          <p className="text-gray-600">Moderate user reviews and handle complaints</p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedReviews.size > 0 && (
            <Button
              variant="outline"
              onClick={bulkDeleteReviews}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {selectedReviews.size}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={exportReviews}
            disabled={reviews.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium">Filter by rating:</span>
            {['all', '1', '2', '3', '4', '5'].map((rating) => (
              <button
                key={rating}
                onClick={() => setRatingFilter(rating)}
                className={`px-3 py-1 rounded-md text-sm ${
                  ratingFilter === rating
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {rating === 'all' ? 'All' : `${rating} ⭐`}
              </button>
            ))}
            {reviews.length > 0 && (
              <>
                <span className="border-l border-gray-300 h-6 mx-2"></span>
                <button
                  onClick={selectAllReviews}
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  {selectedReviews.size === reviews.length ? (
                    <CheckSquare className="h-4 w-4 mr-1" />
                  ) : (
                    <Square className="h-4 w-4 mr-1" />
                  )}
                  {selectedReviews.size === reviews.length ? 'Deselect All' : 'Select All'}
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* Selection Checkbox */}
                <button
                  onClick={() => toggleSelectReview(review.id)}
                  className="mt-1"
                >
                  {selectedReviews.has(review.id) ? (
                    <CheckSquare className="h-5 w-5 text-primary-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {/* Avatar */}
                <Avatar
                  src={review.user.avatar}
                  alt={review.user.name}
                  initials={review.user.name.split(' ').map(n => n[0]).join('')}
                />

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold">{review.user.name}</h3>
                    <span className="text-sm text-gray-500">•</span>
                    <div className={`flex items-center ${getRatingColor(review.rating)}`}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'fill-current' : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {review.homestay ? (
                      <>for <span className="font-medium">{review.homestay.name}</span></>
                    ) : (
                      <span className="text-gray-400">General review</span>
                    )}
                  </p>
                  {review.comment && (
                    <p className="text-gray-800 mb-2">{review.comment}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openResponseModal(review)}
                    title="Send response to reviewer"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Respond
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteReview(review.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && !error && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-500">
              {ratingFilter !== 'all' 
                ? 'No reviews match your filter criteria' 
                : 'No reviews have been submitted yet'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Response Modal */}
      {showResponseModal && responseReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Send Response to {responseReview.user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Original Review */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`flex items-center ${getRatingColor(responseReview.rating)}`}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < responseReview.rating ? 'fill-current' : ''
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {responseReview.homestay?.name || 'General review'}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm">
                    {responseReview.comment || 'No comment provided'}
                  </p>
                </div>

                {/* Response Templates */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Your Response
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTemplates(!showTemplates)}
                    >
                      <MoreVertical className="h-3 w-3 mr-1" />
                      Templates
                    </Button>
                  </div>

                  {showTemplates && (
                    <div className="mb-3 space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <p className="text-xs font-medium text-gray-700 mb-2">Quick Templates:</p>
                      {responseTemplates.map((template) => (
                        <button
                          key={template.name}
                          onClick={() => applyTemplate(template)}
                          className="block w-full text-left px-3 py-2 text-sm bg-white hover:bg-gray-100 rounded border border-gray-200"
                        >
                          <span className="font-medium">{template.name}:</span> {template.text}
                        </button>
                      ))}
                    </div>
                  )}

                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Type your response here..."
                  />
                </div>

                {/* Email Preview */}
                <div className="bg-blue-50 rounded-lg p-4 text-sm">
                  <div className="flex items-start">
                    <Mail className="h-4 w-4 text-blue-600 mt-0.5 mr-2" />
                    <div>
                      <p className="text-blue-800 font-medium">Email will be sent to:</p>
                      <p className="text-blue-700">{responseReview.user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowResponseModal(false);
                      setResponseReview(null);
                      setResponseText('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={sendResponse}
                    className="bg-primary-600 hover:bg-primary-700"
                    disabled={!responseText.trim()}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Response
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
