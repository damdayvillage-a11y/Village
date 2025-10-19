'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Palette, Type, Layout, Code, Save, RotateCcw, Download, Upload, 
  Image, Sliders, Eye, Check, X
} from 'lucide-react';

interface ThemeSettings {
  // Colors
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
  
  // Branding
  siteName: string;
  tagline: string;
  headerLogoUrl: string;
  footerLogoUrl: string;
  faviconUrl: string;
  
  // Typography
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: string;
  headingFontFamily: string;
  
  // Layout
  borderRadius: number;
  boxShadow: boolean;
  animationSpeed: string;
  spacingScale: string;
  
  // Custom
  customCSS: string;
}

const defaultTheme: ThemeSettings = {
  primaryColor: '#3B82F6',
  secondaryColor: '#8B5CF6',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  borderColor: '#E5E7EB',
  successColor: '#10B981',
  warningColor: '#F59E0B',
  errorColor: '#EF4444',
  infoColor: '#3B82F6',
  siteName: 'Village Admin',
  tagline: 'Manage your village platform',
  headerLogoUrl: '',
  footerLogoUrl: '',
  faviconUrl: '',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 16,
  lineHeight: 1.5,
  fontWeight: 'normal',
  headingFontFamily: 'Inter, system-ui, sans-serif',
  borderRadius: 8,
  boxShadow: true,
  animationSpeed: 'normal',
  spacingScale: 'normal',
  customCSS: '',
};

const themePresets = {
  light: {
    name: 'Light Theme',
    ...defaultTheme,
  },
  dark: {
    name: 'Dark Theme',
    primaryColor: '#06B6D4',
    secondaryColor: '#8B5CF6',
    backgroundColor: '#1F2937',
    textColor: '#F9FAFB',
    borderColor: '#374151',
    successColor: '#10B981',
    warningColor: '#F59E0B',
    errorColor: '#EF4444',
    infoColor: '#06B6D4',
    siteName: 'Village Admin',
    tagline: 'Manage your village platform',
    headerLogoUrl: '',
    footerLogoUrl: '',
    faviconUrl: '',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: 'normal',
    headingFontFamily: 'Inter, system-ui, sans-serif',
    borderRadius: 8,
    boxShadow: true,
    animationSpeed: 'normal',
    spacingScale: 'normal',
    customCSS: '',
  },
  highContrast: {
    name: 'High Contrast',
    primaryColor: '#FACC15',
    secondaryColor: '#F59E0B',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    successColor: '#22C55E',
    warningColor: '#FACC15',
    errorColor: '#FF0000',
    infoColor: '#3B82F6',
    siteName: 'Village Admin',
    tagline: 'Manage your village platform',
    headerLogoUrl: '',
    footerLogoUrl: '',
    faviconUrl: '',
    fontFamily: 'Arial, sans-serif',
    fontSize: 18,
    lineHeight: 1.6,
    fontWeight: 'bold',
    headingFontFamily: 'Arial, sans-serif',
    borderRadius: 4,
    boxShadow: false,
    animationSpeed: 'slow',
    spacingScale: 'spacious',
    customCSS: '',
  },
  nature: {
    name: 'Nature Theme',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    backgroundColor: '#F0FDF4',
    textColor: '#14532D',
    borderColor: '#BBF7D0',
    successColor: '#10B981',
    warningColor: '#F59E0B',
    errorColor: '#EF4444',
    infoColor: '#3B82F6',
    siteName: 'Village Admin',
    tagline: 'Manage your village platform',
    headerLogoUrl: '',
    footerLogoUrl: '',
    faviconUrl: '',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: 'normal',
    headingFontFamily: 'Inter, system-ui, sans-serif',
    borderRadius: 12,
    boxShadow: true,
    animationSpeed: 'normal',
    spacingScale: 'normal',
    customCSS: '',
  },
  sunset: {
    name: 'Sunset Theme',
    primaryColor: '#F97316',
    secondaryColor: '#DC2626',
    backgroundColor: '#FFF7ED',
    textColor: '#431407',
    borderColor: '#FDBA74',
    successColor: '#10B981',
    warningColor: '#F59E0B',
    errorColor: '#DC2626',
    infoColor: '#3B82F6',
    siteName: 'Village Admin',
    tagline: 'Manage your village platform',
    headerLogoUrl: '',
    footerLogoUrl: '',
    faviconUrl: '',
    fontFamily: 'Georgia, serif',
    fontSize: 16,
    lineHeight: 1.6,
    fontWeight: 'normal',
    headingFontFamily: 'Georgia, serif',
    borderRadius: 16,
    boxShadow: true,
    animationSpeed: 'normal',
    spacingScale: 'normal',
    customCSS: '',
  },
};

const fontFamilies = [
  'Inter, system-ui, sans-serif',
  'Arial, sans-serif',
  'Helvetica, sans-serif',
  'Verdana, sans-serif',
  'Trebuchet MS, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Palatino, serif',
  'Courier New, monospace',
  'Monaco, monospace',
  'Segoe UI, sans-serif',
  'Roboto, sans-serif',
  'Open Sans, sans-serif',
  'Lato, sans-serif',
  'Montserrat, sans-serif',
];

export default function ThemeCustomizer() {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [activeTab, setActiveTab] = useState<string>('colors');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadTheme = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/theme');
      if (response.ok) {
        const data = await response.json();
        setTheme({ ...defaultTheme, ...data.theme });
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyThemeToDOM = useCallback(() => {
    // Apply CSS variables to root
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primaryColor);
    root.style.setProperty('--theme-secondary', theme.secondaryColor);
    root.style.setProperty('--theme-background', theme.backgroundColor);
    root.style.setProperty('--theme-text', theme.textColor);
    root.style.setProperty('--theme-border', theme.borderColor);
    root.style.setProperty('--theme-font-family', theme.fontFamily);
    root.style.setProperty('--theme-font-size', `${theme.fontSize}px`);
    root.style.setProperty('--theme-line-height', theme.lineHeight.toString());
    root.style.setProperty('--theme-border-radius', `${theme.borderRadius}px`);
    
    // Apply custom CSS
    let styleEl = document.getElementById('custom-theme-css');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'custom-theme-css';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = theme.customCSS;
  }, [theme]);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  useEffect(() => {
    // Apply theme to DOM in real-time
    applyThemeToDOM();
  }, [applyThemeToDOM]);

  const saveTheme = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/admin/theme', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Theme saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error('Failed to save theme');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save theme. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const resetTheme = () => {
    if (confirm('Are you sure you want to reset to default theme? This cannot be undone.')) {
      setTheme(defaultTheme);
      setMessage({ type: 'success', text: 'Theme reset to defaults.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const applyPreset = (presetKey: keyof typeof themePresets) => {
    const preset = themePresets[presetKey];
    const { name, ...presetTheme } = preset;
    setTheme(presetTheme as ThemeSettings);
    setMessage({ type: 'success', text: `Applied ${name}` });
    setTimeout(() => setMessage(null), 3000);
  };

  const exportTheme = () => {
    const dataStr = JSON.stringify(theme, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `theme-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTheme = JSON.parse(e.target?.result as string);
        setTheme({ ...defaultTheme, ...importedTheme });
        setMessage({ type: 'success', text: 'Theme imported successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        setMessage({ type: 'error', text: 'Invalid theme file.' });
      }
    };
    reader.readAsText(file);
  };

  const updateTheme = (key: keyof ThemeSettings, value: any) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'branding', label: 'Branding', icon: Image },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'custom', label: 'Custom CSS', icon: Code },
    { id: 'presets', label: 'Presets', icon: Sliders },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Theme Customizer</h2>
          <p className="text-gray-600 mt-1">Customize the look and feel of your admin panel</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportTheme}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input type="file" accept=".json" onChange={importTheme} className="hidden" />
          </label>
          <button
            onClick={resetTheme}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={saveTheme}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Theme'}
          </button>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
          'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Color Palette</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'primaryColor', label: 'Primary Color' },
                  { key: 'secondaryColor', label: 'Secondary Color' },
                  { key: 'backgroundColor', label: 'Background Color' },
                  { key: 'textColor', label: 'Text Color' },
                  { key: 'borderColor', label: 'Border Color' },
                  { key: 'successColor', label: 'Success Color' },
                  { key: 'warningColor', label: 'Warning Color' },
                  { key: 'errorColor', label: 'Error Color' },
                  { key: 'infoColor', label: 'Info Color' },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme[key as keyof ThemeSettings] as string}
                        onChange={(e) => updateTheme(key as keyof ThemeSettings, e.target.value)}
                        className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme[key as keyof ThemeSettings] as string}
                        onChange={(e) => updateTheme(key as keyof ThemeSettings, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Branding Tab */}
          {activeTab === 'branding' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Brand Identity</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={theme.siteName}
                    onChange={(e) => updateTheme('siteName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                  <input
                    type="text"
                    value={theme.tagline}
                    onChange={(e) => updateTheme('tagline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Logo URL
                  </label>
                  <input
                    type="text"
                    value={theme.headerLogoUrl}
                    onChange={(e) => updateTheme('headerLogoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">Recommended: 200x50px</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Logo URL
                  </label>
                  <input
                    type="text"
                    value={theme.footerLogoUrl}
                    onChange={(e) => updateTheme('footerLogoUrl', e.target.value)}
                    placeholder="https://example.com/logo-footer.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
                  <input
                    type="text"
                    value={theme.faviconUrl}
                    onChange={(e) => updateTheme('faviconUrl', e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">Recommended: 32x32px or 64x64px</p>
                </div>
              </div>
            </div>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Typography Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Family (Body)</label>
                  <select
                    value={theme.fontFamily}
                    onChange={(e) => updateTheme('fontFamily', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {fontFamilies.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heading Font Family
                  </label>
                  <select
                    value={theme.headingFontFamily}
                    onChange={(e) => updateTheme('headingFontFamily', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {fontFamilies.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Font Size: {theme.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={theme.fontSize}
                    onChange={(e) => updateTheme('fontSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>12px</span>
                    <span>24px</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Line Height: {theme.lineHeight}
                  </label>
                  <input
                    type="range"
                    min="1.2"
                    max="2.0"
                    step="0.1"
                    value={theme.lineHeight}
                    onChange={(e) => updateTheme('lineHeight', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1.2</span>
                    <span>2.0</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Weight</label>
                  <select
                    value={theme.fontWeight}
                    onChange={(e) => updateTheme('fontWeight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="light">Light (300)</option>
                    <option value="normal">Normal (400)</option>
                    <option value="medium">Medium (500)</option>
                    <option value="semibold">Semi-bold (600)</option>
                    <option value="bold">Bold (700)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Layout Tab */}
          {activeTab === 'layout' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Layout Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Border Radius: {theme.borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={theme.borderRadius}
                    onChange={(e) => updateTheme('borderRadius', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0px (Square)</span>
                    <span>24px (Rounded)</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={theme.boxShadow}
                      onChange={(e) => updateTheme('boxShadow', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Enable Box Shadows</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Animation Speed</label>
                  <select
                    value={theme.animationSpeed}
                    onChange={(e) => updateTheme('animationSpeed', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="none">None (No animations)</option>
                    <option value="fast">Fast (150ms)</option>
                    <option value="normal">Normal (300ms)</option>
                    <option value="slow">Slow (500ms)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spacing Scale</label>
                  <select
                    value={theme.spacingScale}
                    onChange={(e) => updateTheme('spacingScale', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="compact">Compact (Dense layout)</option>
                    <option value="normal">Normal (Balanced)</option>
                    <option value="spacious">Spacious (More padding)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Custom CSS Tab */}
          {activeTab === 'custom' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Custom CSS</h3>
              <p className="text-sm text-gray-600">
                Add custom CSS to override default styles. Use with caution.
              </p>
              
              <textarea
                value={theme.customCSS}
                onChange={(e) => updateTheme('customCSS', e.target.value)}
                placeholder="/* Your custom CSS here */"
                className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm"
              />
            </div>
          )}

          {/* Presets Tab */}
          {activeTab === 'presets' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Theme Presets</h3>
              <p className="text-sm text-gray-600">
                Quick start with a pre-configured theme. You can customize it further after applying.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(themePresets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key as keyof typeof themePresets)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded"
                        style={{ backgroundColor: preset.primaryColor }}
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{preset.name}</h4>
                        <p className="text-sm text-gray-500">Click to apply</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {[
                        preset.primaryColor,
                        preset.secondaryColor,
                        preset.successColor,
                        preset.warningColor,
                        preset.errorColor,
                      ].map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
            </div>
            
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-4"
              style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                fontFamily: theme.fontFamily,
                fontSize: `${theme.fontSize}px`,
                lineHeight: theme.lineHeight,
              }}
            >
              <div
                className="p-4 rounded"
                style={{
                  backgroundColor: theme.primaryColor,
                  color: '#FFFFFF',
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                <h4 className="font-bold" style={{ fontFamily: theme.headingFontFamily }}>
                  {theme.siteName}
                </h4>
                <p className="text-sm">{theme.tagline}</p>
              </div>

              <div
                className="p-3 rounded border"
                style={{
                  borderColor: theme.borderColor,
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                <p>Sample text with current typography settings.</p>
              </div>

              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded text-white"
                  style={{
                    backgroundColor: theme.primaryColor,
                    borderRadius: `${theme.borderRadius}px`,
                  }}
                >
                  Primary
                </button>
                <button
                  className="px-4 py-2 rounded text-white"
                  style={{
                    backgroundColor: theme.secondaryColor,
                    borderRadius: `${theme.borderRadius}px`,
                  }}
                >
                  Secondary
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { color: theme.successColor, label: 'Success' },
                  { color: theme.warningColor, label: 'Warning' },
                  { color: theme.errorColor, label: 'Error' },
                  { color: theme.infoColor, label: 'Info' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-2 rounded text-sm"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                      borderRadius: `${theme.borderRadius}px`,
                    }}
                  >
                    {item.label} message
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
