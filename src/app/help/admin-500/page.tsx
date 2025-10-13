'use client';

import Link from 'next/link';
import { 
  AlertCircle, 
  Shield, 
  Database, 
  Key, 
  Terminal,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function Admin500HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-full">
              <AlertCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Admin Panel 500 Error - Quick Fix Guide
          </h1>
          <p className="text-gray-300">
            Getting a 500 Internal Server Error after CapRover deployment?
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-2xl p-8 space-y-6">
          {/* Quick Diagnosis */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h2 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Step 1: Check System Status
            </h2>
            <p className="text-purple-800 text-sm mb-3">
              Visit the system status page to see exactly what's wrong:
            </p>
            <Link 
              href="/admin-panel/status"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Shield className="h-4 w-4 mr-2" />
              View System Diagnostics
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>

          {/* Common Issues */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Issues & Quick Fixes</h2>
            
            <div className="space-y-4">
              {/* Issue 1 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <Key className="h-5 w-5 text-orange-500" />
                  Issue 1: CapRover Placeholders Not Replaced
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Environment variables still contain <code className="bg-gray-100 px-1 py-0.5 rounded">$$cap_*$$</code> placeholders
                </p>
                <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                  <p className="font-medium text-gray-900">Fix:</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    <li>Go to CapRover Dashboard → Your App → App Configs</li>
                    <li>Replace <code className="bg-gray-100 px-1">NEXTAUTH_URL=$$cap_appname$$.$$cap_root_domain$$</code></li>
                    <li>With actual domain: <code className="bg-gray-100 px-1">NEXTAUTH_URL=https://your-domain.com</code></li>
                    <li>Click "Save & Update"</li>
                  </ol>
                </div>
              </div>

              {/* Issue 2 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  Issue 2: Database Not Connected
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  The application cannot connect to PostgreSQL database
                </p>
                <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                  <p className="font-medium text-gray-900">Fix:</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    <li>Deploy PostgreSQL in CapRover (Apps → One-Click Apps)</li>
                    <li>Update <code className="bg-gray-100 px-1">DATABASE_URL</code> in App Configs</li>
                    <li>Example: <code className="bg-gray-100 px-1">postgresql://postgres:pass@srv-captain--postgres:5432/villagedb</code></li>
                    <li>Click "Save & Update"</li>
                  </ol>
                </div>
              </div>

              {/* Issue 3 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Issue 3: Admin User Doesn't Exist
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Database is connected but admin user hasn't been created
                </p>
                <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                  <p className="font-medium text-gray-900">Fix (Choose one):</p>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-700">Option A: Via Browser (Easiest)</p>
                    <a 
                      href="/api/admin/init"
                      target="_blank"
                      className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                    >
                      Create Admin User Now
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                    <p className="text-xs text-gray-500">This will create admin user with default credentials</p>
                    
                    <p className="font-medium text-gray-700 mt-3">Option B: Via Container Shell</p>
                    <code className="block bg-gray-900 text-gray-100 p-2 rounded">npm run db:seed</code>
                  </div>
                </div>
              </div>

              {/* Issue 4 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <Key className="h-5 w-5 text-purple-500" />
                  Issue 4: NEXTAUTH_SECRET Invalid
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Authentication secret is missing or too short
                </p>
                <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                  <p className="font-medium text-gray-900">Fix:</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    <li>Generate a secure secret on your computer:</li>
                    <code className="block bg-gray-900 text-gray-100 p-2 rounded my-2">openssl rand -base64 32</code>
                    <li>Copy the output</li>
                    <li>In CapRover App Configs, set <code className="bg-gray-100 px-1">NEXTAUTH_SECRET=&lt;paste-here&gt;</code></li>
                    <li>Click "Save & Update"</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Default Credentials */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Key className="h-5 w-5" />
              Default Admin Credentials
            </h2>
            <div className="text-sm text-blue-800 space-y-1">
              <p>After creating the admin user, login with:</p>
              <div className="bg-white p-3 rounded mt-2 space-y-1 font-mono text-xs">
                <p><span className="font-semibold">Email:</span> admin@damdayvillage.org</p>
                <p><span className="font-semibold">Password:</span> Admin@123</p>
              </div>
              <p className="text-red-600 font-semibold mt-2">⚠️ Change password immediately after first login!</p>
            </div>
          </div>

          {/* Quick Commands */}
          <div className="bg-gray-800 rounded-lg p-6 text-white">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Quick Commands (Run in Container Shell)
            </h3>
            <div className="space-y-3 text-sm font-mono">
              <div>
                <div className="text-gray-400 mb-1"># Run database migrations</div>
                <div className="bg-gray-900 px-3 py-2 rounded">npx prisma migrate deploy</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1"># Create admin user</div>
                <div className="bg-gray-900 px-3 py-2 rounded">npm run db:seed</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1"># Check environment variables</div>
                <div className="bg-gray-900 px-3 py-2 rounded">npm run validate:env</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Link
              href="/admin-panel/status"
              className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center font-semibold"
            >
              Check System Status
            </Link>
            <Link
              href="/admin-panel/login"
              className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-semibold"
            >
              Try Login Again
            </Link>
          </div>

          {/* Additional Resources */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold text-gray-900 mb-3">Need More Help?</h3>
            <div className="space-y-2 text-sm">
              <div>
                <a 
                  href="https://github.com/damdayvillage-a11y/Village/blob/main/CAPROVER_ADMIN_PANEL_FIX.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 underline flex items-center gap-1"
                >
                  Complete CapRover Fix Guide
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div>
                <a 
                  href="https://github.com/damdayvillage-a11y/Village/blob/main/QUICK_FIX_ADMIN_500.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 underline flex items-center gap-1"
                >
                  Quick Fix Reference
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div>
                <a 
                  href="https://github.com/damdayvillage-a11y/Village/blob/main/TROUBLESHOOTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 underline flex items-center gap-1"
                >
                  General Troubleshooting Guide
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
