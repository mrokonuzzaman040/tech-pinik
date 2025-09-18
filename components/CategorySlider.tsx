'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
}

interface CategorySliderProps {
  categories: Category[];
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || categories.length === 0) return;

    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollDelay = 30;

    const autoScroll = () => {
      if (scrollContainer) {
        scrollAmount += scrollStep;
        scrollContainer.scrollLeft = scrollAmount;

        // Reset scroll when reaching the end
        if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollAmount = 0;
        }
      }
    };

    const interval = setInterval(autoScroll, scrollDelay);

    // Pause on hover
    const handleMouseEnter = () => clearInterval(interval);
    const handleMouseLeave = () => {
      clearInterval(interval);
      setInterval(autoScroll, scrollDelay);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(interval);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [categories.length]);

  if (!categories || categories.length === 0) {
    return null;
  }

  // Duplicate categories for seamless scrolling
  const duplicatedCategories = [...categories, ...categories];

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
          Shop by Category
        </h2>
        
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-hidden scrollbar-hide"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedCategories.map((category, index) => (
            <Link
              key={`${category.id}-${index}`}
              href={`/category/${category.slug}`}
              className="flex-shrink-0 group"
            >
              <div className="flex flex-col items-center space-y-3 p-4 hover:bg-white rounded-lg transition-all duration-300 min-w-[120px]">
                {/* Category Icon/Image */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-md group-hover:shadow-lg transition-shadow overflow-hidden border-2 border-gray-100 group-hover:border-blue-200">
                  <Image
                    src={category.icon || category.image || 'https://via.placeholder.com/80x80/E5E7EB/9CA3AF?text=?'}
                    alt={category.name}
                    fill
                    className="object-cover p-2"
                  />
                </div>
                
                {/* Category Name */}
                <h3 className="text-sm md:text-base font-medium text-gray-700 group-hover:text-blue-600 transition-colors text-center leading-tight">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}