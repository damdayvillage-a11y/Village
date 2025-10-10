'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Key,
  Server,
  Terminal
} from 'lucide-react';

interface SystemCheck {
  status: 'healthy' | 'degraded' | 'misconfigured';
  healthy: boolean;
  checks: {
    timestamp: string;
    environment: string;
    nextauth_url: {
      configured: boolean;
      value: string;
    };
    nextauth_secret: {
      configured: boolean;
      length: number;
      valid: boolean;
    };
    database: {
      configured: boolean;
      connected: boolean;
      admin_exists: boolean;
      message: string;
    };
  };
  recommendations: string[];
  help: string | null;
}

export default function AdminStatusPage() {
  const [systemCheck, setSystemCheck] = useState<SystemCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSystem = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      setSystemCheck(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check system status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSystem();
  }, []);

  const StatusIcon = ({ status }: { status: boolean | string }) => {
    if (status === true || status === 'healthy') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (status === 'degraded') {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Admin Panel System Status
          </h1>
          <p className="text-gray-300">
            Diagnostic information for troubleshooting login issues
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-2xl p-8 space-y-6">
          {/* Refresh Button */}
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-900">System Health Checks</h2>
            <button
              onClick={checkSystem}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 text-purple-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Checking system status...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {systemCheck && !loading && (
            <>
              {/* Overall Status */}
              <div className={`p-4 rounded-lg ${
                systemCheck.healthy 
                  ? 'bg-green-50 border border-green-200' 
                  : systemCheck.status === 'degraded'
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  <StatusIcon status={systemCheck.status} />
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${
                      systemCheck.healthy ? 'text-green-900' : 
                      systemCheck.status === 'degraded' ? 'text-yellow-900' : 'text-red-900'
                    }`}>
                      {systemCheck.healthy ? 'All Systems Operational' : 
                       systemCheck.status === 'degraded' ? 'Service Degraded' : 'Configuration Error'}
                    </h3>
                    <p className={
                      systemCheck.healthy ? 'text-green-700' : 
                      systemCheck.status === 'degraded' ? 'text-yellow-700' : 'text-red-700'
                    }>
                      {systemCheck.healthy 
                        ? 'All checks passed. The admin panel should be accessible.' 
                        : 'Some issues detected. See details below.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Environment Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Environment:</span>
                  <span className="font-mono text-sm font-semibold">{systemCheck.checks.environment}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Last checked: {new Date(systemCheck.checks.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Configuration Checks */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Configuration Status
                </h3>

                {/* NEXTAUTH_URL */}
                <div className="pl-7 space-y-2">
                  <div className="flex items-start gap-3">
                    <StatusIcon status={systemCheck.checks.nextauth_url.configured && 
                                       systemCheck.checks.nextauth_url.value === 'OK'} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">NEXTAUTH_URL</div>
                      <div className="text-sm text-gray-600">
                        Status: {systemCheck.checks.nextauth_url.value}
                      </div>
                      {systemCheck.checks.nextauth_url.value !== 'OK' && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm font-mono text-red-600">
                          ⚠️ {systemCheck.checks.nextauth_url.value}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* NEXTAUTH_SECRET */}
                <div className="pl-7 space-y-2">
                  <div className="flex items-start gap-3">
                    <StatusIcon status={systemCheck.checks.nextauth_secret.valid} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">NEXTAUTH_SECRET</div>
                      <div className="text-sm text-gray-600">
                        {systemCheck.checks.nextauth_secret.configured 
                          ? `Length: ${systemCheck.checks.nextauth_secret.length} characters`
                          : 'Not configured'}
                      </div>
                      {!systemCheck.checks.nextauth_secret.valid && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                          {!systemCheck.checks.nextauth_secret.configured && (
                            <span className="text-yellow-700">Not set. Generate with: <code className="font-mono bg-yellow-100 px-1">openssl rand -base64 32</code></span>
                          )}
                          {systemCheck.checks.nextauth_secret.configured && 
                           systemCheck.checks.nextauth_secret.length < 32 && (
                            <span className="text-yellow-700">Too short (minimum 32 characters required)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Database */}
                <div className="pl-7 space-y-2">
                  <div className="flex items-start gap-3">
                    <StatusIcon status={systemCheck.checks.database.connected && 
                                       systemCheck.checks.database.admin_exists} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Database Connection
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Configured: {systemCheck.checks.database.configured ? '✓' : '✗'}</div>
                        <div>Connected: {systemCheck.checks.database.connected ? '✓' : '✗'}</div>
                        <div>Admin User: {systemCheck.checks.database.admin_exists ? '✓' : '✗'}</div>
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          {systemCheck.checks.database.message}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {systemCheck.recommendations.length > 0 && 
               systemCheck.recommendations[0] !== 'All checks passed!' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Recommended Actions
                  </h3>
                  <ul className="space-y-2">
                    {systemCheck.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-blue-900">
                        <span className="font-bold">{idx + 1}.</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Help Documentation */}
              {systemCheck.help && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-700 mb-2">{systemCheck.help}</p>
                  <div className="flex gap-2">
                    <Link 
                      href="/docs/PRODUCTION_LOGIN_TROUBLESHOOTING.md" 
                      className="text-sm text-purple-600 hover:text-purple-700 underline"
                    >
                      View Troubleshooting Guide
                    </Link>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {systemCheck.healthy ? (
                  <Link
                    href="/admin-panel/login"
                    className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-semibold"
                  >
                    Go to Admin Login
                  </Link>
                ) : (
                  <div className="flex-1 py-3 px-4 bg-gray-300 text-gray-600 rounded-lg text-center font-semibold cursor-not-allowed">
                    Fix Issues First
                  </div>
                )}
                <Link
                  href="/"
                  className="py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  Home
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Quick Command Reference */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 text-white">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Quick Command Reference
          </h3>
          <div className="space-y-3 text-sm font-mono">
            <div>
              <div className="text-gray-400 mb-1"># Check environment variables</div>
              <div className="bg-gray-900 px-3 py-2 rounded">npm run validate:env</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1"># Create admin user</div>
              <div className="bg-gray-900 px-3 py-2 rounded">npm run db:seed</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1"># Verify admin user exists</div>
              <div className="bg-gray-900 px-3 py-2 rounded">npm run admin:verify</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1"># Generate secure secret</div>
              <div className="bg-gray-900 px-3 py-2 rounded">openssl rand -base64 32</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
