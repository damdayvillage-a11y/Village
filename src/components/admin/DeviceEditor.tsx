"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { Textarea } from '@/lib/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/components/ui/select';
import { Save, Loader2, Radio } from 'lucide-react';

interface DeviceEditorProps {
  device?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

export function DeviceEditor({ device, onSave, onCancel }: DeviceEditorProps) {
  const [formData, setFormData] = useState(device || {
    name: '',
    type: 'AIR_QUALITY',
    location: '',
    latitude: null,
    longitude: null,
    elevation: null,
    firmware: '',
    config: {},
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/devices', {
        method: device ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        if (onSave) onSave(data);
      }
    } catch (error) {
      console.error('Failed to save device:', error);
    } finally {
      setSaving(false);
    }
  };

  const deviceTypes = [
    { value: 'AIR_QUALITY', label: 'Air Quality Sensor' },
    { value: 'ENERGY_METER', label: 'Energy Meter' },
    { value: 'SOLAR_PANEL', label: 'Solar Panel' },
    { value: 'WEATHER_STATION', label: 'Weather Station' },
    { value: 'WATER_SENSOR', label: 'Water Sensor' },
    { value: 'MOTION_SENSOR', label: 'Motion Sensor' },
    { value: 'CAMERA', label: 'Camera' },
    { value: 'MICROPHONE', label: 'Microphone' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5" />
              <CardTitle>{device ? 'Edit Device' : 'Register New Device'}</CardTitle>
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
                Save Device
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label>Device Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Air Quality Monitor - Main Square"
              />
            </div>
            
            <div>
              <Label>Device Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {deviceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Location Description</Label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., Main Square, Near Village Center"
              />
            </div>
          </div>

          {/* GPS Coordinates */}
          <div>
            <Label className="mb-2 block">GPS Coordinates (Optional)</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs">Latitude</Label>
                <Input
                  type="number"
                  step="0.000001"
                  value={formData.latitude || ''}
                  onChange={(e) => handleChange('latitude', parseFloat(e.target.value) || null)}
                  placeholder="e.g., 27.7172"
                />
              </div>
              <div>
                <Label className="text-xs">Longitude</Label>
                <Input
                  type="number"
                  step="0.000001"
                  value={formData.longitude || ''}
                  onChange={(e) => handleChange('longitude', parseFloat(e.target.value) || null)}
                  placeholder="e.g., 85.3240"
                />
              </div>
              <div>
                <Label className="text-xs">Elevation (m)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.elevation || ''}
                  onChange={(e) => handleChange('elevation', parseFloat(e.target.value) || null)}
                  placeholder="e.g., 1400"
                />
              </div>
            </div>
          </div>

          {/* Firmware Version */}
          <div>
            <Label>Firmware Version</Label>
            <Input
              value={formData.firmware}
              onChange={(e) => handleChange('firmware', e.target.value)}
              placeholder="e.g., v1.2.3"
            />
          </div>

          {/* Configuration JSON */}
          <div>
            <Label>Device Configuration (JSON)</Label>
            <Textarea
              value={JSON.stringify(formData.config, null, 2)}
              onChange={(e) => {
                try {
                  const config = JSON.parse(e.target.value);
                  handleChange('config', config);
                } catch (error) {
                  // Invalid JSON, ignore
                }
              }}
              rows={8}
              placeholder={`{
  "samplingInterval": 60,
  "calibration": {
    "offset": 0,
    "scale": 1
  }
}`}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Device-specific configuration in JSON format
            </p>
          </div>

          {/* Device Status Info (if editing) */}
          {device && (
            <div className="border-t pt-4">
              <Label className="mb-2 block">Device Status</Label>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="ml-2 font-medium">{device.status}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Seen:</span>
                  <span className="ml-2 font-medium">
                    {device.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Never'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <span className="ml-2 font-medium">
                    {new Date(device.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Device ID:</span>
                  <span className="ml-2 font-mono text-xs">{device.id}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DeviceEditor;
