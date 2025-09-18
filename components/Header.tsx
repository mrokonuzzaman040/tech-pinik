'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCartIcon, MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { items, itemCount } = useCart();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-secondary-800 text-white py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          <span>🚚 Free Delivery on Orders Over ৳1000 | 📞 Call: +880 1700-000000</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary-500 text-white px-3 py-2 rounded-lg font-bold text-xl">
              Tech Pinik
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-primary-500 text-white px-6 py-2 rounded-r-lg hover:bg-primary-600 transition-colors"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Cart & Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-primary-500 text-white px-6 py-2 rounded-r-lg hover:bg-primary-600 transition-colors"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-50 border-t hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex flex-row space-x-8 py-2">
            <li>
              <Link href="/" className="block py-2 px-4 text-gray-700 hover:text-primary-600 hover:bg-white rounded transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="block py-2 px-4 text-gray-700 hover:text-primary-600 hover:bg-white rounded transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/categories" className="block py-2 px-4 text-gray-700 hover:text-primary-600 hover:bg-white rounded transition-colors">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/about" className="block py-2 px-4 text-gray-700 hover:text-primary-600 hover:bg-white rounded transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="block py-2 px-4 text-gray-700 hover:text-primary-600 hover:bg-white rounded transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}