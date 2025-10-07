'use client';

import { useState, useEffect } from 'react';

interface HealthCheck {
  status: string;
  timestamp: string;
  version: string;
  environment: string;
  services: {
    database: {
      status: string;
      timestamp: string;
      error?: string;
    };
  };
}

export default function DashboardPage() {
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const healthData = await response.json();
        setHealth(healthData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check health');
      }
    };

    const fetchDevices = async () => {
      try {
        const response = await fetch('/api/devices');
        if (response.ok) {
          const deviceData = await response.json();
          setDevices(deviceData.devices || []);
        }
      } catch (err) {
        console.error('Failed to fetch devices:', err);
      }
    };

    Promise.all([checkHealth(), fetchDevices()]).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-display font-bold text-gray-900">
                Smart Village Dashboard
              </h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">
                {health?.environment} • v{health?.version}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* System Health */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
          <div className="bg-white rounded-lg shadow p-6">
            {health ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    health.status === 'healthy' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {health.status === 'healthy' ? '✅' : '❌'} {health.status}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Overall Status</p>
                </div>
                
                <div className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    health.services.database.status === 'healthy' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {health.services.database.status === 'healthy' ? '🗄️' : '❌'} {health.services.database.status}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Database</p>
                  {health.services.database.error && (
                    <p className="mt-1 text-xs text-red-600">{health.services.database.error}</p>
                  )}
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    🌐 {health.environment}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Environment</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">Unable to fetch system health</p>
              </div>
            )}
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                Last checked: {health?.timestamp ? new Date(health.timestamp).toLocaleString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Health Check</h3>
                  <p className="text-sm text-gray-600 mb-2">System health monitoring</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">GET /api/health</code>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Devices</h3>
                  <p className="text-sm text-gray-600 mb-2">IoT device management</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">GET /api/devices</code>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Telemetry</h3>
                  <p className="text-sm text-gray-600 mb-2">Sensor data ingestion</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">POST /api/telemetry</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Devices Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">IoT Devices</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              {devices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {devices.map((device) => (
                    <div key={device.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{device.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          device.status === 'ONLINE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {device.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{device.type}</p>
                      <p className="text-xs text-gray-500">{device.location}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Devices Found</h3>
                  <p className="text-gray-500">
                    {health?.services.database.status !== 'healthy' 
                      ? 'Database connection required to load devices' 
                      : 'No IoT devices have been registered yet'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Database Schema Info */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Database Schema</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900">Users & Auth</h3>
                <p className="text-sm text-blue-600 mt-1">User management, sessions, roles</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900">Villages & Homestays</h3>
                <p className="text-sm text-green-600 mt-1">Location data, bookings</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900">IoT & Sensors</h3>
                <p className="text-sm text-purple-600 mt-1">Devices, telemetry data</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-900">Marketplace & DAO</h3>
                <p className="text-sm text-orange-600 mt-1">Products, projects, voting</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}