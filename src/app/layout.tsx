import type { Metadata, Viewport } from 'next';
import { SessionProvider } from '@/lib/components/providers/SessionProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smart Carbon-Free Village - Damday',
  description:
    'Experience Damday Village, a carbon-neutral, culturally-rich, and technologically progressive model village in the Himalayas.',
  keywords: [
    'carbon-free',
    'village',
    'tourism',
    'sustainability',
    'Himalayas',
    'eco-tourism',
  ],
  authors: [{ name: 'Damday Village Team' }],
  manifest: '/manifest.json',
  robots: 'index, follow',
  openGraph: {
    title: 'Smart Carbon-Free Village - Damday',
    description:
      'Experience Damday Village, a carbon-neutral model village in the Himalayas',
    type: 'website',
    locale: 'en_US',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#10b981',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="Smart Carbon-Free Village" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Damday Village" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#10b981" />
        
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      </head>
      <body className="font-sans antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}