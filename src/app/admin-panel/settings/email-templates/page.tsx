'use client';

import { useState, useEffect } from 'react';
import EmailTemplateEditor from '@/components/admin/EmailTemplateEditor';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  category: string;
  variables: string[];
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      // This would call the actual API
      // const response = await fetch('/api/admin/email-templates');
      // const data = await response.json();
      // setTemplates(data.templates);

      // Mock data for now
      setTemplates([
        {
          id: '1',
          name: 'Welcome Email',
          subject: 'Welcome to {{site.name}}!',
          htmlContent: '<h1>Welcome {{user.name}}!</h1><p>Thank you for joining us.</p>',
          textContent: 'Welcome {{user.name}}! Thank you for joining us.',
          category: 'Welcome',
          variables: ['user.name', 'site.name'],
          isActive: true,
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = async (templateData: Partial<EmailTemplate>) => {
    try {
      // This would call the actual API
      // const response = await fetch('/api/admin/email-templates', {
      //   method: selectedTemplate ? 'PUT' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(templateData),
      //   });
      // const data = await response.json();

      await loadTemplates();
      setIsEditing(false);
      setSelectedTemplate(undefined);
    } catch (error) {
      throw new Error('Failed to save template');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      // await fetch(`/api/admin/email-templates/${id}`, { method: 'DELETE' });
      await loadTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === 'All' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(templates.map((t) => t.category))];

  if (isEditing) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {selectedTemplate ? 'Edit' : 'Create'} Email Template
        </h1>
        <EmailTemplateEditor
          template={selectedTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setIsEditing(false);
            setSelectedTemplate(undefined);
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
        <button
          onClick={() => {
            setSelectedTemplate(undefined);
            setIsEditing(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          + Create Template
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Templates List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">Loading templates...</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No templates found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <span className="text-xs text-gray-500">{template.category}</span>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    template.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {template.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.subject}</p>
              <div className="text-xs text-gray-500 mb-3">
                Version {template.version} • Updated{' '}
                {new Date(template.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setIsEditing(true);
                  }}
                  className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
