'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/lib/components/ui/Button';
import { Card } from '@/lib/components/ui/Card';
import { AdminPanelLayout } from '@/lib/components/admin-panel/AdminPanelLayout';
import Image from 'next/image';

interface VillageLeader {
  id: string;
  name: string;
  position: string;
  photo: string;
  message: string | null;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function LeadershipManagementPage() {
  const { data: session } = useSession();
  const [leaders, setLeaders] = useState<VillageLeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLeader, setEditingLeader] = useState<VillageLeader | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    photo: '',
    message: '',
    priority: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const response = await fetch('/api/admin/village-leaders');
      const data = await response.json();
      if (data.success) {
        setLeaders(data.data);
      }
    } catch (error) {
      console.error('Error fetching leaders:', error);
      setMessage('Failed to load leaders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const url = editingLeader
        ? `/api/admin/village-leaders/${editingLeader.id}`
        : '/api/admin/village-leaders';
      
      const method = editingLeader ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ ${editingLeader ? 'Updated' : 'Created'} successfully!`);
        setShowForm(false);
        setEditingLeader(null);
        resetForm();
        fetchLeaders();
      } else {
        setMessage('⚠️ ' + (data.message || data.error || 'Failed to save'));
      }
    } catch (error) {
      console.error('Error saving leader:', error);
      setMessage('❌ Error saving leader');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (leader: VillageLeader) => {
    setEditingLeader(leader);
    setFormData({
      name: leader.name,
      position: leader.position,
      photo: leader.photo,
      message: leader.message || '',
      priority: leader.priority,
      isActive: leader.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/village-leaders/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Deleted successfully!');
        fetchLeaders();
      } else {
        setMessage('⚠️ Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting leader:', error);
      setMessage('❌ Error deleting leader');
    }
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const reorderedLeaders = [...leaders];
    const [movedLeader] = reorderedLeaders.splice(fromIndex, 1);
    reorderedLeaders.splice(toIndex, 0, movedLeader);

    // Update priorities
    const updatedLeaders = reorderedLeaders.map((leader, index) => ({
      ...leader,
      priority: index,
    }));

    setLeaders(updatedLeaders);

    // Save to backend
    try {
      const response = await fetch('/api/admin/village-leaders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaders: updatedLeaders.map(l => ({ id: l.id, priority: l.priority })),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('✅ Order updated successfully!');
      }
    } catch (error) {
      console.error('Error reordering leaders:', error);
      setMessage('❌ Error updating order');
      fetchLeaders(); // Revert on error
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      photo: '',
      message: '',
      priority: leaders.length,
      isActive: true,
    });
    setEditingLeader(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLeader(null);
    resetForm();
  };

  if (loading) {
    return (
      <AdminPanelLayout session={session}>
        <div className="max-w-6xl mx-auto">
          <p>Loading leaders...</p>
        </div>
      </AdminPanelLayout>
    );
  }

  return (
    <AdminPanelLayout 
      session={session}
      title="👥 Leadership Management"
      subtitle="Manage village leadership displayed on the homepage"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-end gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => window.open('/', '_blank')}
          >
            👁️ Preview Homepage
          </Button>
          {!showForm && (
            <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              ➕ Add Leader
            </Button>
          )}
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.includes('✅')
                ? 'bg-green-50 border-2 border-green-200 text-green-900'
                : message.includes('⚠️')
                ? 'bg-yellow-50 border-2 border-yellow-200 text-yellow-900'
                : 'bg-red-50 border-2 border-red-200 text-red-900'
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingLeader ? '✏️ Edit Leader' : '➕ Add New Leader'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name (in Hindi) *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="श्री नरेंद्र मोदी"
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position (in Hindi) *
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="प्रधान मंत्री"
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo URL *
                </label>
                <input
                  type="url"
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  placeholder="https://example.com/photo.jpg or /images/leaders/pm.jpg"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                {formData.photo && (
                  <div className="mt-2 relative h-32 w-32 rounded-lg overflow-hidden border-2 border-gray-300">
                    {formData.photo.startsWith('http') ? (
                      <img
                        src={formData.photo}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional, primarily for Gram Pradhan)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  placeholder="हमारे गांव में आपका स्वागत है..."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The message will be displayed prominently with the leader's card
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Priority (Lower = First)
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: parseInt(e.target.value) })
                    }
                    min={0}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 mt-8">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Active (Show on homepage)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? '💾 Saving...' : editingLeader ? '💾 Update' : '➕ Create'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Leaders List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Current Leaders</h2>
            <span className="text-sm text-gray-600">{leaders.length} leader(s)</span>
          </div>

          {leaders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-lg mb-2">No leaders added yet</p>
              <p className="text-sm">Click "Add Leader" to create the first one</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaders.map((leader, index) => (
                <div
                  key={leader.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 ${
                    leader.isActive
                      ? 'bg-white border-gray-200'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleReorder(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() =>
                        handleReorder(index, Math.min(leaders.length - 1, index + 1))
                      }
                      disabled={index === leaders.length - 1}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                      title="Move down"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Photo */}
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 flex-shrink-0">
                    {leader.photo.startsWith('http') ? (
                      <img
                        src={leader.photo}
                        alt={leader.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-900 text-2xl">
                        👤
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">{leader.name}</h3>
                      {!leader.isActive && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-blue-600 font-semibold">{leader.position}</p>
                    {leader.message && (
                      <p className="text-sm text-gray-600 mt-1 italic">
                        "{leader.message.substring(0, 100)}
                        {leader.message.length > 100 ? '...' : ''}"
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Priority: {leader.priority}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(leader)}>
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(leader.id, leader.name)}
                      className="text-red-600 hover:bg-red-50 border-red-300"
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Help */}
        <Card className="p-6 mt-6 bg-blue-50 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-2">💡 Tips</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
            <li>Leaders are displayed in priority order (lowest first)</li>
            <li>Use the ▲▼ buttons to quickly reorder leaders</li>
            <li>Only active leaders are shown on the homepage</li>
            <li>
              The Gram Pradhan card will span full width when it's the last in the list
            </li>
            <li>Use Hindi text for names and positions for authenticity</li>
            <li>Messages are optional but recommended for the Gram Pradhan</li>
            <li>Photo URLs can be external (https://...) or local (/images/...)</li>
          </ul>
        </Card>
      </div>
    </AdminPanelLayout>
  );
}
