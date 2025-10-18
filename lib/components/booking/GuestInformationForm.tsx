"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { User, Mail, Phone, Users, MessageSquare, Loader2 } from 'lucide-react';

export interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  numberOfGuests: number;
  specialRequests?: string;
}

interface GuestInformationFormProps {
  initialData?: Partial<GuestInfo>;
  onSubmit: (data: GuestInfo) => Promise<void>;
  onBack?: () => void;
  maxGuests?: number;
}

export const GuestInformationForm: React.FC<GuestInformationFormProps> = ({
  initialData,
  onSubmit,
  onBack,
  maxGuests = 10,
}) => {
  const [formData, setFormData] = useState<GuestInfo>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    numberOfGuests: initialData?.numberOfGuests || 1,
    specialRequests: initialData?.specialRequests || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GuestInfo, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GuestInfo, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (formData.numberOfGuests < 1) {
      newErrors.numberOfGuests = 'At least 1 guest required';
    } else if (formData.numberOfGuests > maxGuests) {
      newErrors.numberOfGuests = \`Maximum \${maxGuests} guests allowed\`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof GuestInfo, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">
              <User className="inline h-4 w-4 mr-1" />
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter your full name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">
              <Mail className="inline h-4 w-4 mr-1" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your.email@example.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">
              <Phone className="inline h-4 w-4 mr-1" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Number of Guests */}
          <div>
            <Label htmlFor="guests">
              <Users className="inline h-4 w-4 mr-1" />
              Number of Guests *
            </Label>
            <Input
              id="guests"
              type="number"
              min="1"
              max={maxGuests}
              value={formData.numberOfGuests}
              onChange={(e) => handleChange('numberOfGuests', parseInt(e.target.value) || 1)}
              className={errors.numberOfGuests ? 'border-red-500' : ''}
            />
            {errors.numberOfGuests && (
              <p className="text-red-500 text-sm mt-1">{errors.numberOfGuests}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Maximum {maxGuests} guests allowed
            </p>
          </div>

          {/* Special Requests */}
          <div>
            <Label htmlFor="requests">
              <MessageSquare className="inline h-4 w-4 mr-1" />
              Special Requests (Optional)
            </Label>
            <textarea
              id="requests"
              value={formData.specialRequests}
              onChange={(e) => handleChange('specialRequests', e.target.value)}
              placeholder="Any special requirements or requests..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {onBack && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={submitting}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Continue to Payment'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
