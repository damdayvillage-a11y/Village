"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { Textarea } from '@/lib/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/components/ui/select';
import { Save, Loader2, Calendar } from 'lucide-react';

interface ProjectEditorProps {
  project?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

export function ProjectEditor({ project, onSave, onCancel }: ProjectEditorProps) {
  const [formData, setFormData] = useState(project || {
    name: '',
    description: '',
    fundingGoal: 0,
    status: 'PLANNING',
    startDate: '',
    endDate: '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: project ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        if (onSave) onSave(data);
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setSaving(false);
    }
  };

  const projectStatuses = [
    { value: 'PLANNING', label: 'Planning' },
    { value: 'VOTING', label: 'Voting' },
    { value: 'FUNDED', label: 'Funded' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <CardTitle>{project ? 'Edit Project' : 'Create New Project'}</CardTitle>
            </div>
            <div className="flex gap-2">
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Project
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label>Project Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Solar Panel Installation"
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the community project..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Funding Goal ($)</Label>
                <Input
                  type="number"
                  step="100"
                  value={formData.fundingGoal}
                  onChange={(e) => handleChange('fundingGoal', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 50000"
                />
              </div>
              <div>
                <Label>Project Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate ? formData.startDate.split('T')[0] : ''}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate ? formData.endDate.split('T')[0] : ''}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Transparency Section */}
          <div className="border-t pt-4">
            <Label className="mb-2 block">Progress Photos (URLs, comma-separated)</Label>
            <Textarea
              value={
                Array.isArray(formData.photos)
                  ? formData.photos.join(', ')
                  : ''
              }
              onChange={(e) => {
                const urls = e.target.value.split(',').map((u) => u.trim()).filter(Boolean);
                handleChange('photos', urls);
              }}
              placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Add progress documentation photos for transparency
            </p>
          </div>

          {/* Blockchain Integration (Optional) */}
          <div className="border-t pt-4">
            <Label>Smart Contract Address (Optional)</Label>
            <Input
              value={formData.contractAddress || ''}
              onChange={(e) => handleChange('contractAddress', e.target.value)}
              placeholder="0x..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Blockchain smart contract for transparent funding
            </p>
          </div>

          {/* Project Status Info (if editing) */}
          {project && (
            <div className="border-t pt-4">
              <Label className="mb-2 block">Project Statistics</Label>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Current Funding:</span>
                  <span className="ml-2 font-medium">
                    ${project.currentFunding?.toLocaleString() || 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Progress:</span>
                  <span className="ml-2 font-medium">
                    {project.fundingGoal
                      ? ((project.currentFunding / project.fundingGoal) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <span className="ml-2 font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Project ID:</span>
                  <span className="ml-2 font-mono text-xs">{project.id}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ProjectEditor;
