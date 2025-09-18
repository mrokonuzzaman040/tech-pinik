import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Tech Pinik - Your Trusted Electronics Store in Bangladesh",
  description: "Shop the latest electronics, gadgets, and tech accessories in Bangladesh. Fast delivery, cash on delivery available. Best prices guaranteed.",
  keywords: ["electronics", "gadgets", "tech", "bangladesh", "online shopping", "mobile", "laptop", "accessories"],
  authors: [{ name: "Tech Pinik" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Tech Pinik - Your Trusted Electronics Store in Bangladesh",
    description: "Shop the latest electronics, gadgets, and tech accessories in Bangladesh. Fast delivery, cash on delivery available.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
