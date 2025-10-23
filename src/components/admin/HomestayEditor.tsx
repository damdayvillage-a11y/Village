"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { Textarea } from '@/lib/components/ui/textarea';
import { Badge } from '@/lib/components/ui/Badge';
import { Save, Loader2, Home, Plus, X } from 'lucide-react';

interface HomestayEditorProps {
  homestay?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

export function HomestayEditor({ homestay, onSave, onCancel }: HomestayEditorProps) {
  const [formData, setFormData] = useState(homestay || {
    name: '',
    description: '',
    rooms: 1,
    maxGuests: 2,
    basePrice: 0,
    location: '',
    amenities: [],
    photos: [],
    carbonFootprint: 0,
  });
  const [saving, setSaving] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const [newPhoto, setNewPhoto] = useState('');

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const addAmenity = () => {
    if (newAmenity && !formData.amenities.includes(newAmenity)) {
      setFormData({ ...formData, amenities: [...formData.amenities, newAmenity] });
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((a: string) => a !== amenity),
    });
  };

  const addPhoto = () => {
    if (newPhoto && !formData.photos.includes(newPhoto)) {
      setFormData({ ...formData, photos: [...formData.photos, newPhoto] });
      setNewPhoto('');
    }
  };

  const removePhoto = (photo: string) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((p: string) => p !== photo),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/homestays', {
        method: homestay ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        if (onSave) onSave(data);
      }
    } catch (error) {
      console.error('Failed to save homestay:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              <CardTitle>{homestay ? 'Edit Homestay' : 'Create Homestay'}</CardTitle>
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
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label>Homestay Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Cozy Mountain Retreat"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                placeholder="Describe your homestay..."
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Address or location"
              />
            </div>
          </div>

          {/* Capacity & Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Number of Rooms</Label>
              <Input
                type="number"
                min="1"
                value={formData.rooms}
                onChange={(e) => handleChange('rooms', parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <Label>Max Guests</Label>
              <Input
                type="number"
                min="1"
                value={formData.maxGuests}
                onChange={(e) => handleChange('maxGuests', parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <Label>Base Price (per night)</Label>
              <Input
                type="number"
                min="0"
                value={formData.basePrice}
                onChange={(e) => handleChange('basePrice', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label>Amenities</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add amenity..."
                onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
              />
              <Button onClick={addAmenity} type="button">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity: string) => (
                <Badge key={amenity} variant="default" className="flex items-center gap-1">
                  {amenity}
                  <button onClick={() => removeAmenity(amenity)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div>
            <Label>Photos (URLs)</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newPhoto}
                onChange={(e) => setNewPhoto(e.target.value)}
                placeholder="Add photo URL..."
                onKeyPress={(e) => e.key === 'Enter' && addPhoto()}
              />
              <Button onClick={addPhoto} type="button">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {formData.photos.map((photo: string, index: number) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    onClick={() => removePhoto(photo)}
                    className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Carbon Footprint */}
          <div>
            <Label>Carbon Footprint (kg CO₂/night)</Label>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={formData.carbonFootprint}
              onChange={(e) => handleChange('carbonFootprint', parseFloat(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Estimated carbon footprint per guest per night
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default HomestayEditor;
