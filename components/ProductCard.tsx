'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { ProductImage } from './OptimizedImage';
import LoadingSpinner from './LoadingSpinner';
import { ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  brand: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const itemQuantity = getItemQuantity(product._id);
  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0) return;
    
    setIsLoading(true);
    try {
      addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        stock: product.stock
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group ${className}`}>
      <Link href={`/product/${product.slug}`}>
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              -{discountPercentage}%
            </div>
          )}
          
          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
              <EyeIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
          
          {/* Product Name */}
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-blue-600">
                ৳{product.price.toLocaleString()}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-gray-500 line-through">
                  ৳{product.comparePrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isLoading}
            className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : itemQuantity > 0
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <ShoppingCartIcon className="h-4 w-4" />
            )}
            <span>
              {product.stock === 0 
                ? 'Out of Stock' 
                : isLoading
                ? 'Adding...'
                : itemQuantity > 0 
                ? `In Cart (${itemQuantity})` 
                : 'Add to Cart'
              }
            </span>
          </button>
        </div>
      </Link>
    </div>
  );
}