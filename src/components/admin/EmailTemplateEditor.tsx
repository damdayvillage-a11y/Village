'use client';

import { useState, useEffect } from 'react';
import { logActivity } from '@/lib/activity-logger';
import { EmailTemplate, TEMPLATE_CATEGORIES } from '@/types/email-template';

interface EmailTemplateEditorProps {
  template?: EmailTemplate;
  onSave: (template: Partial<EmailTemplate>) => Promise<void>;
  onCancel: () => void;
}

const AVAILABLE_VARIABLES = {
  User: [
    { key: '{{user.name}}', description: 'User full name' },
    { key: '{{user.email}}', description: 'User email address' },
    { key: '{{user.role}}', description: 'User role' },
    { key: '{{user.phone}}', description: 'User phone number' },
  ],
  Booking: [
    { key: '{{booking.id}}', description: 'Booking ID' },
    { key: '{{booking.checkIn}}', description: 'Check-in date' },
    { key: '{{booking.checkOut}}', description: 'Check-out date' },
    { key: '{{booking.total}}', description: 'Booking total amount' },
    { key: '{{booking.status}}', description: 'Booking status' },
  ],
  Order: [
    { key: '{{order.id}}', description: 'Order ID' },
    { key: '{{order.total}}', description: 'Order total amount' },
    { key: '{{order.status}}', description: 'Order status' },
    { key: '{{order.items}}', description: 'Order items list' },
  ],
  Product: [
    { key: '{{product.name}}', description: 'Product name' },
    { key: '{{product.price}}', description: 'Product price' },
    { key: '{{product.category}}', description: 'Product category' },
  ],
  System: [
    { key: '{{site.name}}', description: 'Site name' },
    { key: '{{site.url}}', description: 'Site URL' },
    { key: '{{date}}', description: 'Current date' },
    { key: '{{year}}', description: 'Current year' },
  ],
};

export default function EmailTemplateEditor({
  template,
  onSave,
  onCancel,
}: EmailTemplateEditorProps) {
  const [formData, setFormData] = useState<Partial<EmailTemplate>>({
    name: template?.name || '',
    subject: template?.subject || '',
    htmlContent: template?.htmlContent || '',
    textContent: template?.textContent || '',
    category: template?.category || 'Custom',
    isActive: template?.isActive ?? true,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState({
    'user.name': 'John Doe',
    'user.email': 'john@example.com',
    'user.role': 'GUEST',
    'booking.id': 'BK-12345',
    'booking.checkIn': '2025-11-01',
    'booking.checkOut': '2025-11-05',
    'booking.total': '₹5,000',
    'order.id': 'ORD-67890',
    'order.total': '₹2,500',
    'site.name': 'Damday Village',
    'site.url': 'https://damdayvillage.com',
    date: new Date().toLocaleDateString(),
    year: new Date().getFullYear().toString(),
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (
    field: keyof EmailTemplate,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const insertVariable = (variable: string, isHtml: boolean) => {
    const field = isHtml ? 'htmlContent' : 'textContent';
    const currentContent = formData[field] || '';
    handleInputChange(field, currentContent + variable);
  };

  const replaceVariables = (content: string): string => {
    let result = content;
    Object.entries(previewData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  };

  const handleSave = async () => {
    setError('');
    setIsSaving(true);

    try {
      // Validation
      if (!formData.name || !formData.subject || !formData.htmlContent) {
        setError('Name, subject, and HTML content are required');
        return;
      }

      await onSave(formData);

      // Log activity
      // Note: userId should come from auth context in production
      // For now, activity logging is optional and won't break if user is not authenticated
      try {
        await logActivity({
          userId: 'system', // TODO: Replace with actual user ID from auth context
          action: template ? 'UPDATE' : 'CREATE',
          entity: 'EmailTemplate',
          entityId: template?.id,
          description: `${template ? 'Updated' : 'Created'} email template: ${formData.name}`,
          metadata: {
            templateName: formData.name,
            category: formData.category,
          },
        });
      } catch (logError) {
        // Activity logging should not break the main flow
        console.warn('Failed to log activity:', logError);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Template Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Welcome Email"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          >
            {TEMPLATE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Subject *
        </label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => handleInputChange('subject', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          placeholder="e.g., Welcome to {{site.name}}!"
        />
      </div>

      {/* Variables Panel */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Available Variables
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(AVAILABLE_VARIABLES).map(([group, variables]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold text-gray-600 mb-2">
                {group}
              </h4>
              <div className="space-y-1">
                {variables.map((variable) => (
                  <button
                    key={variable.key}
                    onClick={() => insertVariable(variable.key, true)}
                    className="text-xs text-left w-full px-2 py-1 bg-white border border-gray-200 rounded hover:bg-green-50 hover:border-green-300 transition-colors"
                    title={variable.description}
                  >
                    {variable.key}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HTML Content */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            HTML Content *
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-green-600 hover:text-green-700"
          >
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
        </div>
        <textarea
          value={formData.htmlContent}
          onChange={(e) => handleInputChange('htmlContent', e.target.value)}
          rows={12}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 font-mono text-sm"
          placeholder="Enter HTML content with variables..."
        />
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="border-2 border-green-200 rounded-md p-4 bg-white">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Preview (with sample data)
          </h3>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded text-xs mb-3">
            ⚠️ Preview only - HTML is NOT sanitized. In production, use a library like DOMPurify to sanitize HTML before rendering.
          </div>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: replaceVariables(formData.htmlContent || ''),
            }}
          />
        </div>
      )}

      {/* Plain Text Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Plain Text Content (Fallback)
        </label>
        <textarea
          value={formData.textContent}
          onChange={(e) => handleInputChange('textContent', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 font-mono text-sm"
          placeholder="Plain text version (optional)..."
        />
      </div>

      {/* Active Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
          Template is active
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
        </button>
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
        <strong>Tips:</strong>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Use variables like {'{{user.name}}'} to personalize emails</li>
          <li>HTML content supports full HTML and inline CSS</li>
          <li>Plain text version is used as fallback for email clients that don't support HTML</li>
          <li>Preview shows how the email will look with sample data</li>
          <li>All template changes are logged for audit purposes</li>
        </ul>
      </div>
    </div>
  );
}
