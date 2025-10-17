'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Activity, 
  AlertTriangle, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Search,
  Download,
  RefreshCw,
  Eye,
  CheckCircle,
  Clock,
  MapPin,
  TrendingUp,
  Thermometer,
  Droplets,
  Wind,
  Zap
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'ERROR';
  location: string;
  lastSeen: string;
  createdAt: string;
  telemetry?: {
    temperature?: number;
    humidity?: number;
    airQuality?: number;
    power?: number;
  };
}

interface DeviceStats {
  total: number;
  online: number;
  offline: number;
  maintenance?: number;
  error?: number;
}

export default function IoTDeviceManagement() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DeviceStats>({ total: 0, online: 0, offline: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    villageId: ''
  });

  useEffect(() => {
    loadDevices();
  }, [statusFilter]);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter.toUpperCase());
      }
      
      const response = await fetch(`/api/admin/devices?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch devices');
      
      const data = await response.json();
      setDevices(data.devices || []);
      setStats(data.stats || { total: 0, online: 0, offline: 0 });
    } catch (error) {
      console.error('Error loading devices:', error);
      alert('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  const filteredDevices = devices.filter((device) =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setFormData({ name: '', type: '', location: '', villageId: '' });
    setShowAddModal(true);
  };

  const openEditModal = (device: Device) => {
    setSelectedDevice(device);
    setFormData({
      name: device.name,
      type: device.type,
      location: device.location,
      villageId: ''
    });
    setShowEditModal(true);
  };

  const openDetailsModal = (device: Device) => {
    setSelectedDevice(device);
    setShowDetailsModal(true);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const saveDevice = async () => {
    try {
      if (!formData.name || !formData.type) {
        alert('Please fill in all required fields');
        return;
      }

      if (showAddModal) {
        // Create new device
        if (!formData.villageId) {
          alert('Village ID is required for new devices');
          return;
        }

        const response = await fetch('/api/admin/devices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to create device');
        alert('Device created successfully');
      } else if (showEditModal && selectedDevice) {
        // Update existing device
        const response = await fetch('/api/admin/devices', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceId: selectedDevice.id,
            name: formData.name,
            type: formData.type,
            location: formData.location,
          }),
        });

        if (!response.ok) throw new Error('Failed to update device');
        alert('Device updated successfully');
      }

      setShowAddModal(false);
      setShowEditModal(false);
      loadDevices();
    } catch (error) {
      console.error('Error saving device:', error);
      alert('Failed to save device');
    }
  };

  const deleteDevice = async (deviceId: string) => {
    if (!confirm('Are you sure you want to delete this device?')) return;

    try {
      const response = await fetch(`/api/admin/devices?id=${deviceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete device');
      alert('Device deleted successfully');
      loadDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
      alert('Failed to delete device');
    }
  };

  const exportToCSV = () => {
    const headers = ['Device ID', 'Name', 'Type', 'Status', 'Location', 'Last Seen', 'Created At'];
    const rows = filteredDevices.map(device => [
      device.id,
      device.name,
      device.type,
      device.status,
      device.location,
      new Date(device.lastSeen).toLocaleString(),
      new Date(device.createdAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iot-devices_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'text-green-600 bg-green-100';
      case 'OFFLINE':
        return 'text-gray-600 bg-gray-100';
      case 'MAINTENANCE':
        return 'text-yellow-600 bg-yellow-100';
      case 'ERROR':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return <Wifi className="w-4 h-4" />;
      case 'OFFLINE':
        return <WifiOff className="w-4 h-4" />;
      case 'MAINTENANCE':
        return <Clock className="w-4 h-4" />;
      case 'ERROR':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('temp') || lowerType.includes('thermometer')) {
      return <Thermometer className="w-5 h-5" />;
    } else if (lowerType.includes('humid') || lowerType.includes('moisture')) {
      return <Droplets className="w-5 h-5" />;
    } else if (lowerType.includes('air') || lowerType.includes('wind')) {
      return <Wind className="w-5 h-5" />;
    } else if (lowerType.includes('power') || lowerType.includes('energy')) {
      return <Zap className="w-5 h-5" />;
    }
    return <Activity className="w-5 h-5" />;
  };

  const getTimeSinceLastSeen = (lastSeen: string) => {
    const now = new Date();
    const seen = new Date(lastSeen);
    const diffMs = now.getTime() - seen.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">IoT Device Management</h1>
          <p className="text-gray-600">Monitor and manage IoT devices across the village</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadDevices}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
            disabled={filteredDevices.length === 0}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Device
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Devices</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Online</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.online}</p>
            </div>
            <Wifi className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">{stats.offline}</p>
            </div>
            <WifiOff className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Uptime</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {stats.total > 0 ? Math.round((stats.online / stats.total) * 100) : 0}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search devices by name, type, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* Devices Grid */}
      {filteredDevices.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow border border-gray-200 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No devices found</p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Your First Device
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((device) => (
            <div
              key={device.id}
              className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getTypeIcon(device.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{device.name}</h3>
                    <p className="text-sm text-gray-600">{device.type}</p>
                  </div>
                </div>
                <span
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    device.status
                  )}`}
                >
                  {getStatusIcon(device.status)}
                  {device.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{device.location || 'No location'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Last seen: {getTimeSinceLastSeen(device.lastSeen)}</span>
                </div>
              </div>

              {/* Telemetry Data (if available) */}
              {device.telemetry && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-2">Latest Readings</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {device.telemetry.temperature !== undefined && (
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-orange-600" />
                        <span>{device.telemetry.temperature}°C</span>
                      </div>
                    )}
                    {device.telemetry.humidity !== undefined && (
                      <div className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-blue-600" />
                        <span>{device.telemetry.humidity}%</span>
                      </div>
                    )}
                    {device.telemetry.power !== undefined && (
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-yellow-600" />
                        <span>{device.telemetry.power}W</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => openDetailsModal(device)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => openEditModal(device)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => deleteDevice(device.id)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Device Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {showAddModal ? 'Add New Device' : 'Edit Device'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Temperature Sensor 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => handleFormChange('type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Temperature Sensor, Air Quality Monitor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Main Square, Community Center"
                />
              </div>

              {showAddModal && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Village ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.villageId}
                    onChange={(e) => handleFormChange('villageId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter village ID"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Required for creating new devices
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveDevice}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {showAddModal ? 'Add Device' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Device Details Modal */}
      {showDetailsModal && selectedDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Device Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  {getTypeIcon(selectedDevice.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedDevice.name}</h3>
                  <p className="text-gray-600">{selectedDevice.type}</p>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(
                      selectedDevice.status
                    )}`}
                  >
                    {getStatusIcon(selectedDevice.status)}
                    {selectedDevice.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Location</p>
                  <p className="text-gray-900">{selectedDevice.location || 'Not specified'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Last Seen</p>
                  <p className="text-gray-900">{getTimeSinceLastSeen(selectedDevice.lastSeen)}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600 mb-2">Device Information</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Device ID:</span>
                    <span className="text-gray-900 font-mono">{selectedDevice.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-900">
                      {new Date(selectedDevice.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-gray-900">
                      {new Date(selectedDevice.lastSeen).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {selectedDevice.telemetry && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-3">Latest Telemetry Data</p>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedDevice.telemetry.temperature !== undefined && (
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-xs text-gray-600">Temperature</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedDevice.telemetry.temperature}°C
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedDevice.telemetry.humidity !== undefined && (
                      <div className="flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-600">Humidity</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedDevice.telemetry.humidity}%
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedDevice.telemetry.power !== undefined && (
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-xs text-gray-600">Power</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedDevice.telemetry.power}W
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedDevice.telemetry.airQuality !== undefined && (
                      <div className="flex items-center gap-2">
                        <Wind className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-600">Air Quality</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedDevice.telemetry.airQuality} AQI
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  openEditModal(selectedDevice);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Edit Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
