"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { Badge } from '@/lib/components/ui/Badge';
import { Key, TestTube, CheckCircle2, XCircle, Loader2, Eye, EyeOff } from 'lucide-react';

interface APIKey {
  name: string;
  key: string;
  secret?: string;
  status: 'not_configured' | 'testing' | 'valid' | 'invalid';
  lastTested?: Date;
}

export const APIKeyManager: React.FC = () => {
  const [keys, setKeys] = useState<Record<string, APIKey>>({
    razorpay: {
      name: 'Razorpay',
      key: '',
      secret: '',
      status: 'not_configured',
    },
    sendgrid: {
      name: 'SendGrid',
      key: '',
      status: 'not_configured',
    },
  });

  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Valid
          </Badge>
        );
      case 'invalid':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Invalid
          </Badge>
        );
      case 'testing':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Testing...
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            Not Configured
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">API Key Manager</h2>
        <p className="text-gray-600">Configure and validate your external service API keys</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {Object.entries(keys).map(([keyName, keyData]) => (
          <Card key={keyName}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  {keyData.name}
                </CardTitle>
                {getStatusBadge(keyData.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>API Key</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type={visible[keyName] ? 'text' : 'password'}
                    value={keyData.key}
                    onChange={(e) => setKeys({
                      ...keys,
                      [keyName]: { ...keyData, key: e.target.value },
                    })}
                    placeholder="Enter API key..."
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVisible({ ...visible, [keyName]: !visible[keyName] })}
                  >
                    {visible[keyName] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button variant="outline">
                <TestTube className="h-4 w-4 mr-2" />
                Test & Save
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
