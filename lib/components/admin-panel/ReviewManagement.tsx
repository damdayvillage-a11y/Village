'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import { Avatar } from '@/lib/components/ui/Avatar';
import { 
  MessageSquare,
  Star,
  Trash2,
  AlertCircle
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

  useEffect(() => {
    loadReviews();
  }, [ratingFilter]);

  const loadReviews = async () => {
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
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reviews & Complaints</h2>
          <p className="text-gray-600">Moderate user reviews and handle complaints</p>
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
          <div className="flex items-center space-x-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex space-x-4 flex-1">
                  <Avatar
                    src={review.user.avatar}
                    alt={review.user.name}
                    initials={review.user.name.split(' ').map(n => n[0]).join('')}
                  />
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
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteReview(review.id)}
                  className="ml-4"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
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
    </div>
  );
}
