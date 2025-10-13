'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      const { message, details } = getErrorInfo(error);
      setErrorMessage(message);
      setErrorDetails(details);
    } else {
      setErrorMessage('An unexpected error occurred');
      setErrorDetails('Please try again or contact support if the problem persists.');
    }
  }, [searchParams]);

  const getErrorInfo = (error: string): { message: string; details: string } => {
    switch (error) {
      case 'Configuration':
        return {
          message: 'Server Configuration Error',
          details: 'There is a problem with the server configuration. This usually means the database is not accessible or environment variables are not set correctly.'
        };
      case 'AccessDenied':
        return {
          message: 'Access Denied',
          details: 'You do not have permission to sign in. Please contact the administrator if you believe this is an error.'
        };
      case 'Verification':
        return {
          message: 'Verification Error',
          details: 'The verification link is invalid or has expired. Please request a new verification email.'
        };
      case 'OAuthSignin':
        return {
          message: 'OAuth Sign In Error',
          details: 'There was a problem signing in with the OAuth provider. Please try again or use a different sign in method.'
        };
      case 'OAuthCallback':
        return {
          message: 'OAuth Callback Error',
          details: 'There was a problem processing the OAuth callback. Please try signing in again.'
        };
      case 'OAuthCreateAccount':
        return {
          message: 'Account Creation Error',
          details: 'Could not create an account with the OAuth provider. Please try again or use a different sign in method.'
        };
      case 'EmailCreateAccount':
        return {
          message: 'Email Account Creation Error',
          details: 'Could not create an account with this email. The email may already be in use.'
        };
      case 'Callback':
        return {
          message: 'Callback Error',
          details: 'There was a problem processing the sign in callback. Please try again.'
        };
      case 'OAuthAccountNotLinked':
        return {
          message: 'Account Not Linked',
          details: 'This email is already associated with another account. Please sign in using your original sign in method.'
        };
      case 'EmailSignin':
        return {
          message: 'Email Sign In Error',
          details: 'The verification email could not be sent. Please check your email address and try again.'
        };
      case 'CredentialsSignin':
        return {
          message: 'Invalid Credentials',
          details: 'The email or password you entered is incorrect. Please try again.'
        };
      case 'DatabaseError':
        return {
          message: 'Database Connection Error',
          details: 'Unable to connect to the database. This may be a temporary issue. Please try again in a moment, or contact the administrator if the problem persists.'
        };
      case 'SessionRequired':
        return {
          message: 'Session Required',
          details: 'You must be signed in to access this page.'
        };
      case 'Default':
      default:
        return {
          message: 'Authentication Error',
          details: 'An error occurred during authentication. Please try again or contact support if the problem persists.'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-display font-bold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We encountered a problem while trying to sign you in
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {errorMessage}
              </h3>
              <p className="text-gray-600">
                {errorDetails}
              </p>
            </div>

            <div className="pt-4 space-y-3">
              {(errorMessage === 'Server Configuration Error' || errorMessage === 'Database Connection Error') && (
                <Link 
                  href="/admin-panel/status"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  View System Status & Diagnostics
                </Link>
              )}
              
              <Link 
                href="/auth/signin"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Link>

              <Link 
                href="/"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-200">
              {(errorMessage === 'Server Configuration Error' || errorMessage === 'Database Connection Error') && (
                <p className="text-xs text-gray-600 text-center mb-2">
                  📖 See the{' '}
                  <Link href="/help/admin-500" className="text-purple-600 hover:text-purple-500 underline font-medium">
                    Admin 500 Error Fix Guide
                  </Link>
                  {' '}for detailed troubleshooting steps
                </p>
              )}
              <p className="text-xs text-gray-500 text-center">
                If this problem persists, please contact support at{' '}
                <a href="mailto:support@damdayvillage.com" className="text-primary-600 hover:text-primary-500">
                  support@damdayvillage.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <Link href="/contact" className="font-medium text-primary-600 hover:text-primary-500">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-10 w-10 text-red-600 animate-pulse" />
          </div>
          <p className="text-gray-600">Loading error information...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
