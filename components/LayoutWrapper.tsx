'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    // Admin layout - clean without header/footer
    return (
      <div className="min-h-screen bg-gray-100">
        {children}
      </div>
    );
  }

  // Public layout - with header/footer
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {/* Footer */}
      <footer className="bg-secondary-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 TechPinik. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
