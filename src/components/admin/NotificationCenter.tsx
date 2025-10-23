'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Settings, Filter } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  category: 'booking' | 'order' | 'user' | 'system' | 'marketplace';
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  categories: {
    booking: boolean;
    order: boolean;
    user: boolean;
    system: boolean;
    marketplace: boolean;
  };
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    push: true,
    inApp: true,
    categories: {
      booking: true,
      order: true,
      user: true,
      system: true,
      marketplace: true,
    },
  });

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
    // Set up real-time updates (polling every 30 seconds)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications');
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/admin/notifications/preferences');
      const data = await response.json();
      if (data.preferences) {
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/admin/notifications/${id}/read`, { method: 'POST' });
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/notifications/read-all', { method: 'POST' });
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
    setLoading(false);
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/admin/notifications/${id}`, { method: 'DELETE' });
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const clearAll = async () => {
    if (!confirm('Are you sure you want to delete all notifications?')) return;
    setLoading(true);
    try {
      await fetch('/api/admin/notifications', { method: 'DELETE' });
      setNotifications([]);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
    setLoading(false);
  };

  const savePreferences = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/notifications/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });
      alert('Preferences saved successfully!');
      setShowPreferences(false);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save preferences');
    }
    setLoading(false);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread' && n.read) return false;
    if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'error':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Preferences"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="all">All Categories</option>
                <option value="booking">Bookings</option>
                <option value="order">Orders</option>
                <option value="user">Users</option>
                <option value="marketplace">Marketplace</option>
                <option value="system">System</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={markAllAsRead}
                disabled={loading || unreadCount === 0}
                className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All Read
              </button>
              <button
                onClick={clearAll}
                disabled={loading || notifications.length === 0}
                className="flex-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No notifications</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${getNotificationColor(
                            notification.type
                          )}`}
                        >
                          {notification.type}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {notification.category}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Notification Preferences</h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Channels */}
              <div>
                <h4 className="font-medium mb-2">Notification Channels</h4>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={preferences.email}
                    onChange={(e) =>
                      setPreferences({ ...preferences, email: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <span>Email Notifications</span>
                </label>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={preferences.push}
                    onChange={(e) =>
                      setPreferences({ ...preferences, push: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <span>Push Notifications</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferences.inApp}
                    onChange={(e) =>
                      setPreferences({ ...preferences, inApp: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <span>In-App Notifications</span>
                </label>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-medium mb-2">Categories</h4>
                {Object.entries(preferences.categories).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2 mb-2 capitalize">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          categories: {
                            ...preferences.categories,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span>{key}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowPreferences(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={savePreferences}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
