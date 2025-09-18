'use client';

import Image from 'next/image';
import Link from 'next/link';
import ProductCard from './ProductCard';

interface Product {
  _id: string;
  id: string;
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

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  products: Product[];
}

interface CategoryProductsProps {
  categories: Category[];
}

export default function CategoryProducts({ categories }: CategoryProductsProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      {categories.map((category) => (
        <section key={category.id} className="mb-16">
          {/* Category Banner */}
          <div className="relative h-48 md:h-64 mb-8 rounded-lg overflow-hidden">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-lg md:text-xl opacity-90">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {category.products && category.products.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                  Featured Products
                </h3>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {category.products.slice(0, 10).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Products Available</h3>
              <p className="text-gray-500">Products will be added to this category soon.</p>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}