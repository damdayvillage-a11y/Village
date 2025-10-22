/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Optimize PWA for Docker builds
  buildExcludes: [
    /middleware-manifest\.json$/,
    /build-manifest\.json$/,
    'app-build-manifest.json'
  ],
  maximumFileSizeToCacheInBytes: 2000000, // 2MB limit (reduced for memory optimization)
  // Runtime caching for better performance
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
        }
      }
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
        }
      }
    }
  ],
  // Fallback for build issues in Docker
  fallbacks: {
    document: '/offline'
  },
  // Docker-specific optimizations
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  // Additional Docker build optimization
  publicExcludes: ['!workbox-*.js']
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip type checking during Docker builds to prevent hangs
    ignoreBuildErrors: process.env.CAPROVER_BUILD === 'true' || 
                      (process.env.CI === 'true' && process.env.TYPESCRIPT_NO_TYPE_CHECK === 'true'),
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
    // Optimize builds in containerized environments
    outputFileTracingRoot: process.cwd(),
  },

  async headers() {
    const securityHeaders = [
      {
        key: 'X-Frame-Options',
        value: 'DENY'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()'
      }
    ];

    // Add HSTS header in production
    if (process.env.NODE_ENV === 'production') {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload'
      });
    }

    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      }
    ]
  }
}

module.exports = withPWA(nextConfig)