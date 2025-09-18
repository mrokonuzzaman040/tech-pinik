'use client';

import { useState, useEffect, useRef, ReactNode, useMemo } from 'react';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  className?: string;
}

export default function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = ''
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const { visibleItems, offsetY, totalHeight } = useMemo(() => {
    const containerItemCount = Math.ceil(containerHeight / itemHeight);
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index
    }));

    const offsetY = startIndex * itemHeight;

    return {
      visibleItems,
      offsetY,
      totalHeight
    };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index }) => (
            <div key={index} style={{ height: itemHeight }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Specialized virtualized components
interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
}

interface VirtualizedProductListProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
  className?: string;
}

export function VirtualizedProductList({ 
  products, 
  onProductClick,
  className = '' 
}: VirtualizedProductListProps) {
  return (
    <VirtualizedList
      items={products}
      itemHeight={120}
      containerHeight={600}
      className={className}
      renderItem={(product, index) => (
        <div 
          className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
          onClick={() => onProductClick?.(product)}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg mr-4"
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
            <p className="text-lg font-semibold text-blue-600">${product.price}</p>
          </div>
        </div>
      )}
    />
  );
}

// Search results virtualized list
interface SearchResult {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  slug: string;
}

interface VirtualizedSearchResultsProps {
  results: SearchResult[];
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

export function VirtualizedSearchResults({ 
  results, 
  onResultClick,
  className = '' 
}: VirtualizedSearchResultsProps) {
  return (
    <VirtualizedList
      items={results}
      itemHeight={80}
      containerHeight={400}
      className={className}
      renderItem={(result, index) => (
        <div 
          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
          onClick={() => onResultClick?.(result)}
        >
          <img
            src={result.image}
            alt={result.name}
            className="w-12 h-12 object-cover rounded mr-3"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{result.name}</h4>
            <p className="text-sm text-gray-500">{result.category}</p>
            <p className="text-sm font-semibold text-blue-600">${result.price}</p>
          </div>
        </div>
      )}
    />
  );
}