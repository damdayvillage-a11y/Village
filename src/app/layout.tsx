import type { Metadata, Viewport } from 'next';
import { SessionProvider } from '@/lib/components/providers/SessionProvider';
import { Header } from '../../lib/components/layout/Header';
import { Footer } from '../../lib/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Damday Village - Smart Carbon-Free Village',
    template: '%s | Damday Village',
  },
  description:
    'Experience Damday Village, a carbon-neutral, culturally-rich, and technologically progressive model village in the Himalayas. Book homestays, explore our digital twin, and join our sustainable future.',
  keywords: [
    'carbon-free',
    'village',
    'tourism',
    'sustainability',
    'Himalayas',
    'eco-tourism',
    'smart village',
    'sustainable living',
    'homestay',
    'digital twin',
    'Pithoragarh',
    'Uttarakhand',
    'Kumaon',
    'mountain tourism',
    'green village',
  ],
  authors: [{ name: 'Damday Village Team' }],
  creator: 'Damday Village Team',
  publisher: 'Damday Village',
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://village-app.captain.damdayvillage.com/',
  },
  openGraph: {
    title: 'Damday Village - Smart Carbon-Free Village',
    description:
      'Experience sustainable living in the heart of the Himalayas. Book homestays, explore our digital twin, and join our journey towards a carbon-neutral future.',
    type: 'website',
    locale: 'en_US',
    url: 'https://village-app.captain.damdayvillage.com/',
    siteName: 'Damday Village',
    images: [
      {
        url: 'https://village-app.captain.damdayvillage.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Damday Village - Smart Carbon-Free Village',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Damday Village - Smart Carbon-Free Village',
    description: 'Experience sustainable living in the heart of the Himalayas.',
    creator: '@damdayvillage',
    images: ['https://village-app.captain.damdayvillage.com/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code', // Add actual code later
  },
  category: 'tourism',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#061335', // Primary color from Trust & Authority theme
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="Damday Village" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Damday Village" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#061335" />
        
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      </head>
      <body className="min-h-screen bg-neutral-50 font-sans antialiased">
        <SessionProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}