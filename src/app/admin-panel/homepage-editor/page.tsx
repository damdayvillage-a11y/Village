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
                  Emblem Text (Max 3 characters)
                </label>
                <input
                  type="text"
                  value={config?.emblemText || 'DV'}
                  onChange={(e) => updateField('emblemText', e.target.value)}
                  maxLength={3}
                  placeholder="DV"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Short abbreviation displayed in the circular emblem
                </p>
              </div>
            </div>
          </Card>

          {/* Government Style Settings */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-900">🎨 Style & Appearance</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Homepage Style
                </label>
                <select
                  value={config?.homepageStyle || 'government'}
                  onChange={(e) => updateField('homepageStyle', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="government">Government Portal (Professional)</option>
                  <option value="modern">Modern Minimalist</option>
                  <option value="traditional">Traditional Cultural</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Changes the overall aesthetic and color scheme
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tri-color Border
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config?.showTricolorBorder !== undefined ? config.showTricolorBorder : true}
                    onChange={(e) => updateField('showTricolorBorder', e.target.checked)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Show Indian flag-inspired tri-color accent at top</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Stats Bar
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config?.showQuickStats !== undefined ? config.showQuickStats : true}
                    onChange={(e) => updateField('showQuickStats', e.target.checked)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Show quick stats (Solar Powered, Carbon Neutral, IoT)</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Background Pattern
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config?.showBackgroundPattern !== undefined ? config.showBackgroundPattern : true}
                    onChange={(e) => updateField('showBackgroundPattern', e.target.checked)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Show decorative pattern overlay on hero section</span>
                </label>
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

        {/* Call-to-Action Buttons Management */}
        <Card className="p-6 mt-6">
          <h2 className="text-2xl font-bold mb-4 text-indigo-900">🎯 Call-to-Action Buttons</h2>
          <p className="text-gray-600 mb-4">
            Manage the action buttons displayed in the hero section
          </p>
          
          <div className="space-y-3">
            {config?.ctaButtons && Array.isArray(config.ctaButtons) ? (
              config.ctaButtons.map((button: any, index: number) => (
                <div key={button.id || index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Button Text</label>
                      <div className="text-sm font-medium text-gray-900">{button.text}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Link</label>
                      <div className="text-sm text-blue-600">{button.link}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Style</label>
                      <div className="text-sm text-gray-700 capitalize">{button.variant}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Button {index + 1}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Default CTA buttons are configured</p>
                <p className="text-xs mt-1">Advanced button customization coming soon</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> CTA button customization will be enhanced in a future update. 
              Currently showing the default buttons (Digital Twin, 360° Tour, Browse Homestays).
            </p>
          </div>
        </Card>

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
            <a href="/admin-panel/cms/page-builder" className="text-sm text-green-800 hover:underline font-medium">
              📄 Page Manager →
            </a>
          </div>
        </Card>

        {/* Help Text */}
        <Card className="p-6 mt-6 bg-blue-50 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-2">💡 Tips & Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">🎨 Design Tips</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                <li>Government Portal style gives professional, official appearance</li>
                <li>Tri-color border adds patriotic touch inspired by Indian flag</li>
                <li>Use high-quality images from <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">Unsplash</a></li>
                <li>Keep hero title concise (max 50 characters recommended)</li>
                <li>Bilingual subtitle (Hindi + English) reaches wider audience</li>
                <li>Emblem text should be 2-3 characters (e.g., DV)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">⚙️ Configuration Tips</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                <li>Smaller widget sizes create compact, professional layout</li>
                <li>Village leaders managed in <a href="/admin-panel/leadership" className="underline font-medium">Leadership page</a></li>
                <li>Projects managed in <a href="/admin-panel/projects" className="underline font-medium">Projects page</a></li>
                <li>Changes apply after saving - reload homepage to see them</li>
                <li>Quick stats bar shows key achievements at a glance</li>
                <li>Database must be configured to persist changes permanently</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Features Summary */}
        <Card className="p-6 mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200">
          <h3 className="text-lg font-bold text-purple-900 mb-3">✨ New Homepage Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-3xl mb-2">🏛️</div>
              <h4 className="font-semibold text-gray-900 mb-1">Government Style</h4>
              <p className="text-xs text-gray-600">Professional government portal aesthetic with tri-color accents and official design patterns</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-3xl mb-2">👥</div>
              <h4 className="font-semibold text-gray-900 mb-1">Leadership Display</h4>
              <p className="text-xs text-gray-600">Prominent village leader cards with special styling for Gram Pradhan</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-3xl mb-2">🎨</div>
              <h4 className="font-semibold text-gray-900 mb-1">Color Therapy</h4>
              <p className="text-xs text-gray-600">Professionally chosen colors: Blue (trust), Orange (energy), Green (sustainability)</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
