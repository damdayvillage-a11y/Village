'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/lib/components/ui/Button';
import { Card } from '@/lib/components/ui/Card';

export default function HomepageEditorPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/homepage');
      const data = await response.json();
      if (data.success) {
        setConfig(data.data);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      setMessage('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('✅ Configuration saved successfully! Reload the homepage to see changes.');
      } else {
        setMessage('⚠️ ' + (data.message || data.error || 'Failed to save'));
      }
    } catch (error) {
      console.error('Error saving config:', error);
      setMessage('❌ Error saving configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setConfig({ ...config, [field]: value });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Homepage Editor</h1>
          <p>Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Homepage Editor</h1>
            <p className="text-gray-600 mt-2">Customize the homepage layout, content, and appearance</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => window.open('/', '_blank')}
            >
              👁️ Preview Homepage
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '💾 Saving...' : '💾 Save Changes'}
            </Button>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('✅') ? 'bg-green-50 border-2 border-green-200 text-green-900' :
            message.includes('⚠️') ? 'bg-yellow-50 border-2 border-yellow-200 text-yellow-900' :
            'bg-red-50 border-2 border-red-200 text-red-900'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hero Section Settings */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">🎨 Hero Section</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={config?.heroTitle || ''}
                  onChange={(e) => updateField('heroTitle', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Subtitle (Bilingual)
                </label>
                <input
                  type="text"
                  value={config?.heroSubtitle || ''}
                  onChange={(e) => updateField('heroSubtitle', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={config?.heroDescription || ''}
                  onChange={(e) => updateField('heroDescription', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Image URL (Unsplash or other open-source)
                </label>
                <input
                  type="url"
                  value={config?.heroImage || ''}
                  onChange={(e) => updateField('heroImage', e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                {config?.heroImage && (
                  <div className="mt-2 relative h-32 rounded-lg overflow-hidden">
                    <img
                      src={config.heroImage}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emblem Text
                </label>
                <input
                  type="text"
                  value={config?.emblemText || 'DV'}
                  onChange={(e) => updateField('emblemText', e.target.value)}
                  maxLength={3}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </Card>

          {/* Layout Settings */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-green-900">⚙️ Layout Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Layout Type
                </label>
                <select
                  value={config?.layoutType || 'vertical-sidebar'}
                  onChange={(e) => updateField('layoutType', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="vertical-sidebar">Vertical Sidebar (Current)</option>
                  <option value="horizontal">Horizontal Grid</option>
                  <option value="compact">Compact</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config?.showLeadership !== undefined ? config.showLeadership : true}
                      onChange={(e) => updateField('showLeadership', e.target.checked)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Show Leadership</span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config?.showStatistics !== undefined ? config.showStatistics : true}
                      onChange={(e) => updateField('showStatistics', e.target.checked)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Show Statistics</span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config?.showEnvironment !== undefined ? config.showEnvironment : true}
                      onChange={(e) => updateField('showEnvironment', e.target.checked)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Show Environment</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config?.showProjects !== undefined ? config.showProjects : true}
                      onChange={(e) => updateField('showProjects', e.target.checked)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Show Projects</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config?.showHomestays !== undefined ? config.showHomestays : true}
                      onChange={(e) => updateField('showHomestays', e.target.checked)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Show Homestays</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config?.showProducts !== undefined ? config.showProducts : true}
                      onChange={(e) => updateField('showProducts', e.target.checked)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Show Products</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Projects
                  </label>
                  <input
                    type="number"
                    value={config?.maxProjects || 6}
                    onChange={(e) => updateField('maxProjects', parseInt(e.target.value))}
                    min={1}
                    max={20}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Homestays
                  </label>
                  <input
                    type="number"
                    value={config?.maxHomestays || 3}
                    onChange={(e) => updateField('maxHomestays', parseInt(e.target.value))}
                    min={1}
                    max={12}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Products
                  </label>
                  <input
                    type="number"
                    value={config?.maxProducts || 4}
                    onChange={(e) => updateField('maxProducts', parseInt(e.target.value))}
                    min={1}
                    max={12}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statistics Widget Size
                  </label>
                  <select
                    value={config?.statsSize || 'small'}
                    onChange={(e) => updateField('statsSize', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="small">Small (Compact)</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Environment Widget Size
                  </label>
                  <select
                    value={config?.environmentSize || 'small'}
                    onChange={(e) => updateField('environmentSize', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="small">Small (Compact)</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config?.primaryColor || '#1e40af'}
                      onChange={(e) => updateField('primaryColor', e.target.value)}
                      className="w-16 h-10 border-2 border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config?.primaryColor || '#1e40af'}
                      onChange={(e) => updateField('primaryColor', e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accent Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config?.accentColor || '#f59e0b'}
                      onChange={(e) => updateField('accentColor', e.target.value)}
                      className="w-16 h-10 border-2 border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config?.accentColor || '#f59e0b'}
                      onChange={(e) => updateField('accentColor', e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="p-6 mt-6 bg-green-50 border-2 border-green-200">
          <h3 className="text-lg font-bold text-green-900 mb-2">🔗 Related Pages</h3>
          <div className="flex gap-4">
            <a href="/admin-panel/leadership" className="text-sm text-green-800 hover:underline font-medium">
              👥 Manage Village Leaders →
            </a>
            <a href="/admin-panel/projects" className="text-sm text-green-800 hover:underline font-medium">
              🏗️ Manage Projects →
            </a>
          </div>
        </Card>

        {/* Help Text */}
        <Card className="p-6 mt-6 bg-blue-50 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-2">💡 Tips</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
            <li>Use high-quality images from <a href="https://unsplash.com" target="_blank" className="underline">Unsplash</a> for the hero section</li>
            <li>Keep the hero title concise and impactful (max 50 characters recommended)</li>
            <li>The bilingual subtitle helps reach a wider audience</li>
            <li>Smaller widget sizes create a more compact, professional layout</li>
            <li>Village leaders can be managed in the <a href="/admin-panel/leadership" className="underline font-medium">Leadership Management</a> page</li>
            <li>Changes are applied immediately after saving - reload the homepage to see them</li>
            <li>Database must be configured to persist changes permanently</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
