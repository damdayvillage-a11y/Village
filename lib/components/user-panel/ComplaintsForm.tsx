'use client';

import { useState } from 'react';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import { MessageSquare, AlertCircle, Lightbulb, Clock, CheckCircle } from 'lucide-react';

interface Complaint {
  id: string;
  type: 'complaint' | 'suggestion';
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'reviewed' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
}

interface ComplaintsFormProps {
  complaints: Complaint[];
  onSubmit: (data: {
    type: 'complaint' | 'suggestion';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }) => void;
}

export function ComplaintsForm({ complaints, onSubmit }: ComplaintsFormProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'complaint' as 'complaint' | 'suggestion',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setFormData({
        type: 'complaint',
        title: '',
        description: '',
        priority: 'medium'
      });
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'reviewed':
        return <CheckCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Complaints & Suggestions</h2>
          <p className="text-gray-600">Share your feedback to help us improve</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsFormOpen(true)}
          icon={<MessageSquare className="h-4 w-4" />}
        >
          New Submission
        </Button>
      </div>

      {/* New Submission Form */}
      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Submit New Complaint or Suggestion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="complaint"
                      checked={formData.type === 'complaint'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'complaint' })}
                      className="mr-2"
                    />
                    <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                    Complaint
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="suggestion"
                      checked={formData.type === 'suggestion'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'suggestion' })}
                      className="mr-2"
                    />
                    <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
                    Suggestion
                  </label>
                </div>
              </div>

              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief title for your complaint or suggestion"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Please provide detailed information..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <Button type="submit" variant="primary" loading={isSubmitting}>
                  Submit
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Existing Complaints/Suggestions */}
      <div className="space-y-4">
        {complaints.length > 0 ? (
          complaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {complaint.type === 'complaint' ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {complaint.title}
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getPriorityColor(complaint.priority)}>
                      {complaint.priority}
                    </Badge>
                    <Badge className={getStatusColor(complaint.status)}>
                      {getStatusIcon(complaint.status)}
                      <span className="ml-1">{complaint.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{complaint.description}</p>

                {complaint.adminResponse && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Admin Response</h4>
                    <p className="text-blue-800">{complaint.adminResponse}</p>
                  </div>
                )}

                <div className="flex justify-between text-sm text-gray-500">
                  <span>Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(complaint.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No complaints or suggestions yet
              </h3>
              <p className="text-gray-500 mb-4">
                Help us improve by sharing your feedback
              </p>
              <Button 
                variant="primary" 
                onClick={() => setIsFormOpen(true)}
              >
                Submit Feedback
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}