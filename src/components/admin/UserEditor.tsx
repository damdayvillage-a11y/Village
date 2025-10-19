"use client";

/**
 * User Editor Component
 * Complete user profile editing with role assignment and status management
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Badge } from '@/lib/components/ui/Badge';
import { Loader2, Save, X, Mail, Shield, User, Phone, Image as ImageIcon } from 'lucide-react';

interface UserEditorProps {
  userId?: string;
  onSave?: (user: any) => void;
  onCancel?: () => void;
}

interface UserFormData {
  email: string;
  name: string;
  role: string;
  password?: string;
  autoGeneratePassword: boolean;
  verified: boolean;
  active: boolean;
  sendWelcomeEmail: boolean;
  phone?: string;
  avatar?: string;
}

export const UserEditor: React.FC<UserEditorProps> = ({ userId, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    name: '',
    role: 'GUEST',
    autoGeneratePassword: true,
    verified: false,
    active: true,
    sendWelcomeEmail: false,
  });
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        // Populate form with existing user data
        setFormData({
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          verified: data.user.verified,
          active: data.user.status === 'active',
          autoGeneratePassword: false,
          sendWelcomeEmail: false,
          phone: data.user.phone,
          avatar: data.user.avatar,
        });
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const endpoint = userId ? '/api/admin/users' : '/api/admin/users/create';
      const method = userId ? 'PATCH' : 'POST';

      const payload = userId
        ? {
            userId,
            updates: {
              role: formData.role,
              status: formData.active ? 'active' : 'inactive',
              verified: formData.verified,
            },
          }
        : formData;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.generatedPassword) {
          setGeneratedPassword(data.generatedPassword);
        }
        
        if (onSave) {
          onSave(data.user);
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof UserFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (generatedPassword) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Created Successfully!</CardTitle>
          <CardDescription>
            Please save the generated password. It won't be shown again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm font-medium text-yellow-900 mb-2">Generated Password:</p>
            <code className="text-lg font-mono bg-white px-3 py-2 rounded border block">
              {generatedPassword}
            </code>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(generatedPassword);
                alert('Password copied to clipboard');
              }}
            >
              Copy Password
            </Button>
            <Button onClick={() => setGeneratedPassword(null)}>Done</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{userId ? 'Edit User' : 'Create New User'}</CardTitle>
          <CardDescription>
            {userId
              ? 'Update user information and permissions'
              : 'Add a new user to the system with specified role and permissions'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    disabled={!!userId}
                    required
                    className="pl-10"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="pl-10"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Avatar URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="url"
                    value={formData.avatar || ''}
                    onChange={(e) => handleChange('avatar', e.target.value)}
                    className="pl-10"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Role & Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Role & Permissions
            </h3>

            <div>
              <label className="block text-sm font-medium mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="GUEST">Guest - Basic access</option>
                <option value="HOST">Host - Manage homestays</option>
                <option value="SELLER">Seller - Manage marketplace</option>
                <option value="OPERATOR">Operator - System operations</option>
                <option value="VILLAGE_COUNCIL">Village Council - Community management</option>
                <option value="RESEARCHER">Researcher - Data access</option>
                <option value="ADMIN">Admin - Full system access</option>
              </select>
            </div>
          </div>

          {/* Password Settings (Only for new users) */}
          {!userId && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Password Settings</h3>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoPassword"
                  checked={formData.autoGeneratePassword}
                  onChange={(e) => handleChange('autoGeneratePassword', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="autoPassword" className="text-sm">
                  Auto-generate secure password
                </label>
              </div>

              {!formData.autoGeneratePassword && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required={!formData.autoGeneratePassword}
                    placeholder="Enter secure password"
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 8 characters, include letters, numbers, and special characters
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Account Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Account Status</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">Active Account</p>
                  <p className="text-sm text-gray-600">User can sign in to the system</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => handleChange('active', e.target.checked)}
                  className="rounded h-5 w-5"
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">Email Verified</p>
                  <p className="text-sm text-gray-600">User has verified their email address</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.verified}
                  onChange={(e) => handleChange('verified', e.target.checked)}
                  className="rounded h-5 w-5"
                />
              </div>

              {!userId && (
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Send Welcome Email</p>
                    <p className="text-sm text-gray-600">
                      Send account details and instructions to user
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.sendWelcomeEmail}
                    onChange={(e) => handleChange('sendWelcomeEmail', e.target.checked)}
                    className="rounded h-5 w-5"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Actions */}
        <div className="p-6 border-t flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                {userId ? 'Update User' : 'Create User'}
              </>
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
};
