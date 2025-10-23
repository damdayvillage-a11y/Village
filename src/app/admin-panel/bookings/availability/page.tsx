"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Label } from '@/lib/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/components/ui/select';
import { Save, Loader2, Home, Calendar, Ban } from 'lucide-react';

interface Homestay {
  id: string;
  name: string;
  rooms: number;
}

interface Availability {
  id?: string;
  homestayId: string;
  date: string;
  availableRooms: number;
  isBlocked: boolean;
  reason?: string;
}

export default function AvailabilityManagerPage() {
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [selectedHomestay, setSelectedHomestay] = useState<string>('');
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availableRooms, setAvailableRooms] = useState(0);
  const [blockReason, setBlockReason] = useState('');

  const fetchHomestays = useCallback(async () => {
    try {
      const res = await fetch('/api/homestays');
      if (res.ok) {
        const data = await res.json();
        setHomestays(data.homestays || []);
      }
    } catch (error) {
      console.error('Failed to fetch homestays:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAvailability = useCallback(async () => {
    if (!selectedHomestay) return;
    try {
      const res = await fetch(`/api/admin/bookings/availability?homestayId=${selectedHomestay}`);
      if (res.ok) {
        const data = await res.json();
        setAvailability(data.availability || []);
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    }
  }, [selectedHomestay]);

  useEffect(() => {
    fetchHomestays();
  }, [fetchHomestays]);

  useEffect(() => {
    if (selectedHomestay) {
      fetchAvailability();
    }
  }, [selectedHomestay, fetchAvailability]);

  const handleSetAvailability = async () => {
    if (!selectedHomestay || !startDate || !endDate) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/bookings/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homestayId: selectedHomestay,
          startDate,
          endDate,
          availableRooms,
          isBlocked: availableRooms === 0,
          reason: blockReason || undefined,
        }),
      });

      if (res.ok) {
        await fetchAvailability();
        setStartDate('');
        setEndDate('');
        setAvailableRooms(0);
        setBlockReason('');
      }
    } catch (error) {
      console.error('Failed to set availability:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Availability Manager</h1>
          <p className="text-muted-foreground">Manage homestay availability and blackout dates</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            <CardTitle>Select Homestay</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Select value={selectedHomestay} onValueChange={setSelectedHomestay}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a homestay..." />
            </SelectTrigger>
            <SelectContent>
              {homestays.map((homestay) => (
                <SelectItem key={homestay.id} value={homestay.id}>
                  {homestay.name} ({homestay.rooms} rooms)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedHomestay && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <CardTitle>Set Availability</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Available Rooms (0 to block)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={availableRooms}
                    onChange={(e) => setAvailableRooms(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Block Reason (if blocking)</Label>
                  <Input
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="e.g., Maintenance"
                  />
                </div>
              </div>
              <Button onClick={handleSetAvailability} disabled={saving || !startDate || !endDate}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Set Availability
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {availability.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No availability rules set for this homestay
                  </div>
                ) : (
                  availability.map((avail) => (
                    <div
                      key={avail.id || avail.date}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{new Date(avail.date).toLocaleDateString()}</div>
                        {avail.isBlocked && (
                          <div className="text-sm text-destructive flex items-center gap-1">
                            <Ban className="w-3 h-3" />
                            Blocked: {avail.reason}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {avail.availableRooms} / {homestays.find((h) => h.id === selectedHomestay)?.rooms} rooms
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
