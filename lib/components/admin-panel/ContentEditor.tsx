'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import { 
  Edit3, 
  Save, 
  Eye, 
  Undo, 
  Redo,
  Type,
  Image,
  Layout,
  Palette,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'hero' | 'stats' | 'grid';
  content: any;
  position: number;
  page: string;
}

interface ContentEditorProps {
  page: string;
  onSave: (blocks: ContentBlock[]) => void;
}

export function ContentEditor({ page, onSave }: ContentEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    loadPageContent();
  }, [page]);

  const loadPageContent = async () => {
    try {
      // Load actual page content from API
      const response = await fetch(`/api/admin/content?page=${encodeURIComponent(page)}`);
      
      if (!response.ok) {
        throw new Error('Failed to load content');
      }
      
      const data = await response.json();
      
      // If no blocks exist, use default blocks for the page
      if (data.blocks && data.blocks.length > 0) {
        setBlocks(data.blocks);
      } else {
        // Default blocks for new pages
        const defaultBlocks: ContentBlock[] = [
          {
            id: 'new-1',
            type: 'hero',
            content: {
              title: 'Welcome to Smart Carbon-Free Village',
              subtitle: 'Experience Damday Village in Pithoragarh - a pioneering carbon-neutral, culturally-rich, and technologically progressive model village nestled at 2,100m elevation in the pristine Kumaon Himalayas.',
              backgroundImage: '/hero-bg.jpg',
              ctaText: 'Explore Digital Twin',
              ctaLink: '/digital-twin'
            },
            position: 0,
            page
          },
          {
            id: 'new-2',
            type: 'stats',
            content: {
              stats: [
                { label: 'Solar Grid', value: '45kW Active', color: 'green' },
                { label: 'Air Quality', value: 'Excellent (AQI: 18)', color: 'blue' },
                { label: 'Temperature', value: '22°C', color: 'purple' }
              ]
            },
            position: 1,
            page
          },
          {
            id: 'new-3',
            type: 'grid',
            content: {
              title: 'Available Services',
              subtitle: 'Explore our range of sustainable tourism and community development services',
              items: [
                {
                  title: 'Homestay Booking',
                  description: 'Authentic village accommodations with local families',
                  price: '₹2,500-3,500/night',
                  icon: 'home'
                },
                {
                  title: 'Local Marketplace', 
                  description: 'Handcrafted products from village artisans',
                  price: '25+ Products',
                  icon: 'shop'
                }
              ]
            },
            position: 2,
            page
          }
        ];
        setBlocks(defaultBlocks);
      }
    } catch (error) {
      console.error('Failed to load page content:', error);
      // Set empty blocks on error
      setBlocks([]);
    }
  };

  const updateBlock = (blockId: string, newContent: any) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, content: { ...block.content, ...newContent } }
        : block
    ));
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      // Save blocks to API
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blocks }),
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      const data = await response.json();
      
      // Update blocks with saved data
      setBlocks(data.blocks);
      setUnsavedChanges(false);
      
      // Call parent callback if provided
      if (onSave) {
        await onSave(data.blocks);
      }
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('Failed to save content. Please try again.');
    }
  };

  const renderBlockEditor = (block: ContentBlock) => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <Input
              label="Title"
              value={block.content.title}
              onChange={(e) => updateBlock(block.id, { title: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <textarea
                value={block.content.subtitle}
                onChange={(e) => updateBlock(block.id, { subtitle: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Input
              label="CTA Text"
              value={block.content.ctaText}
              onChange={(e) => updateBlock(block.id, { ctaText: e.target.value })}
            />
            <Input
              label="CTA Link"
              value={block.content.ctaLink}
              onChange={(e) => updateBlock(block.id, { ctaLink: e.target.value })}
            />
          </div>
        );
      
      case 'stats':
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Real-time Stats</h4>
            {block.content.stats.map((stat: any, index: number) => (
              <div key={index} className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Label"
                  value={stat.label}
                  onChange={(e) => {
                    const newStats = [...block.content.stats];
                    newStats[index] = { ...stat, label: e.target.value };
                    updateBlock(block.id, { stats: newStats });
                  }}
                />
                <Input
                  placeholder="Value"
                  value={stat.value}
                  onChange={(e) => {
                    const newStats = [...block.content.stats];
                    newStats[index] = { ...stat, value: e.target.value };
                    updateBlock(block.id, { stats: newStats });
                  }}
                />
                <select
                  value={stat.color}
                  onChange={(e) => {
                    const newStats = [...block.content.stats];
                    newStats[index] = { ...stat, color: e.target.value };
                    updateBlock(block.id, { stats: newStats });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                </select>
              </div>
            ))}
          </div>
        );
      
      case 'grid':
        return (
          <div className="space-y-4">
            <Input
              label="Section Title"
              value={block.content.title}
              onChange={(e) => updateBlock(block.id, { title: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <textarea
                value={block.content.subtitle}
                onChange={(e) => updateBlock(block.id, { subtitle: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Grid Items</h4>
              {block.content.items.map((item: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Item Title"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...block.content.items];
                        newItems[index] = { ...item, title: e.target.value };
                        updateBlock(block.id, { items: newItems });
                      }}
                    />
                    <textarea
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...block.content.items];
                        newItems[index] = { ...item, description: e.target.value };
                        updateBlock(block.id, { items: newItems });
                      }}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Input
                      placeholder="Price/Info"
                      value={item.price}
                      onChange={(e) => {
                        const newItems = [...block.content.items];
                        newItems[index] = { ...item, price: e.target.value };
                        updateBlock(block.id, { items: newItems });
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      
      default:
        return <div>Unsupported block type</div>;
    }
  };

  const getViewportClass = () => {
    switch (viewportMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'w-full';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">Editing: {page}</h3>
          {unsavedChanges && (
            <Badge className="bg-yellow-100 text-yellow-800">
              Unsaved Changes
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Viewport Toggle */}
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-2 ${viewportMode === 'desktop' ? 'bg-primary-100 text-primary-700' : 'text-gray-500'}`}
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`p-2 ${viewportMode === 'tablet' ? 'bg-primary-100 text-primary-700' : 'text-gray-500'}`}
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-2 ${viewportMode === 'mobile' ? 'bg-primary-100 text-primary-700' : 'text-gray-500'}`}
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            icon={<Eye className="h-4 w-4" />}
          >
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!unsavedChanges}
            icon={<Save className="h-4 w-4" />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {isPreviewMode ? 'Preview' : 'Visual Editor'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={getViewportClass()}>
                {isPreviewMode ? (
                  <div className="space-y-6">
                    {blocks.map((block) => (
                      <div key={block.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="text-xs text-gray-500 mb-2 uppercase">
                          {block.type} Block
                        </div>
                        {/* Render preview based on block type */}
                        {block.type === 'hero' && (
                          <div className="text-center py-8">
                            <h1 className="text-3xl font-bold mb-4">{block.content.title}</h1>
                            <p className="text-gray-600 mb-6">{block.content.subtitle}</p>
                            <Button>{block.content.ctaText}</Button>
                          </div>
                        )}
                        {block.type === 'stats' && (
                          <div className="flex justify-center space-x-6">
                            {block.content.stats.map((stat: any, index: number) => (
                              <div key={index} className="text-center">
                                <div className="text-sm font-medium">{stat.label}</div>
                                <div className="text-lg font-bold">{stat.value}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {block.type === 'grid' && (
                          <div>
                            <h2 className="text-2xl font-bold text-center mb-2">{block.content.title}</h2>
                            <p className="text-gray-600 text-center mb-6">{block.content.subtitle}</p>
                            <div className="grid grid-cols-2 gap-4">
                              {block.content.items.map((item: any, index: number) => (
                                <div key={index} className="border rounded-lg p-4">
                                  <h3 className="font-semibold">{item.title}</h3>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                  <div className="text-sm font-medium text-primary-600">{item.price}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blocks.map((block) => (
                      <div
                        key={block.id}
                        onClick={() => setSelectedBlock(block.id)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedBlock === block.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge>{block.type}</Badge>
                          <Edit3 className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="text-sm text-gray-600">
                          Click to edit this {block.type} block
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Block Editor */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedBlock ? 'Edit Block' : 'Select Block'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedBlock ? (
                <div>
                  {blocks
                    .filter(block => block.id === selectedBlock)
                    .map(block => (
                      <div key={block.id}>
                        <div className="mb-4">
                          <Badge className="mb-2">{block.type.toUpperCase()}</Badge>
                        </div>
                        {renderBlockEditor(block)}
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Edit3 className="h-8 w-8 mx-auto mb-2" />
                  <p>Select a block to edit its content</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}