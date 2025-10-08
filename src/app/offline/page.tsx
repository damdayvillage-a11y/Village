'use client'

import { Metadata } from 'next'

// Since this is a client component, we handle metadata differently
const metadata = {
  title: 'Offline - Smart Carbon-Free Village',
  description: 'You are currently offline. Please check your internet connection.',
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.741 9.741 0 0012 2.25zM8.25 12l1.5-1.5M12 8.25v7.5"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You&apos;re Offline
          </h1>
          <p className="text-gray-600">
            It looks like you&apos;ve lost your internet connection. Please check your network settings and try again.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
          
          <div className="text-sm text-gray-500">
            <p>Some features may still be available offline:</p>
            <ul className="mt-2 space-y-1">
              <li>• View cached village information</li>
              <li>• Browse saved articles</li>
              <li>• Access basic navigation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}