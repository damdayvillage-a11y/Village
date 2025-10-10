'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, AlertTriangle } from 'lucide-react';

function AdminLoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const errorParam = searchParams.get('error');

  useEffect(() => {
    if (errorParam) {
      setError(getErrorMessage(errorParam));
    }
  }, [errorParam]);

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      router.push('/admin-panel');
    }
  }, [status, session, router]);

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Invalid admin credentials. Please try again.';
      case 'AccessDenied':
        return 'Access denied. Admin privileges required.';
      case 'Unauthorized':
        return 'You do not have admin privileges.';
      default:
        return 'An error occurred during sign in. Please try again.';
    }
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid admin credentials');
      } else if (result?.ok) {
        // Verify user has admin role
        const session = await fetch('/api/auth/session').then(res => res.json());
        
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin-panel');
        } else {
          setError('Access denied. Admin privileges required.');
          // Sign out non-admin users
          await fetch('/api/auth/signout', { method: 'POST' });
        }
      }
    } catch (error) {
      setError('An error occurred during sign in');
      console.error('Admin login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-display font-bold text-white">
            Admin Panel Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Sign in with your administrator credentials
          </p>
          <p className="mt-1 text-center text-xs text-gray-400">
            Not an admin? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Go to user login</Link>
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleAdminSignIn}>
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700">
                Admin Email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="admin@damdayvillage.com"
              />
            </div>
            
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700">
                Admin Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Enter admin password"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Shield className="h-5 w-5 mr-2" />
                {isLoading ? 'Authenticating...' : 'Sign in as Admin'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              <Shield className="h-3 w-3 inline mr-1" />
              This area is restricted to authorized administrators only
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400">
            Having trouble? Contact system administrator
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-white mx-auto mb-4 animate-pulse" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  );
}
