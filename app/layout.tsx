import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CartProvider } from '@/contexts/CartContext';
import ServiceWorker from '@/components/ServiceWorker';
import { measureWebVitals } from '@/lib/performance';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Tech Pinik - Premium Electronics & Gadgets Store',
    template: '%s | Tech Pinik'
  },
  description: 'Discover the latest electronics, smartphones, laptops, gaming gear, and tech accessories at Tech Pinik. Premium quality products with fast shipping and excellent customer service.',
  keywords: [
    'electronics',
    'smartphones',
    'laptops',
    'gaming',
    'tech accessories',
    'gadgets',
    'computers',
    'tablets',
    'headphones',
    'smart devices',
    'tech store',
    'online electronics'
  ],
  authors: [{ name: 'Tech Pinik Team' }],
  creator: 'Tech Pinik',
  publisher: 'Tech Pinik',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://techpinik.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://techpinik.com',
    title: 'Tech Pinik - Premium Electronics & Gadgets Store',
    description: 'Discover the latest electronics, smartphones, laptops, gaming gear, and tech accessories at Tech Pinik.',
    siteName: 'Tech Pinik',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tech Pinik - Premium Electronics Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Pinik - Premium Electronics & Gadgets Store',
    description: 'Discover the latest electronics, smartphones, laptops, gaming gear, and tech accessories.',
    images: ['/twitter-image.jpg'],
    creator: '@techpinik',
  },
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  other: {
    'theme-color': '#3b82f6',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize performance monitoring
  if (typeof window !== 'undefined') {
    measureWebVitals();
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <CartProvider>
            <ServiceWorker />
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#10b981',
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                    background: '#ef4444',
                  },
                },
              }}
            />
          </CartProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
