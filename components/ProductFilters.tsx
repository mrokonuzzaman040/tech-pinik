'use client';

import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface Filters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  featured?: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    price: true,
    features: true,
  });

  // Fetch categories and brands for filters
  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    try {
      // Fetch categories
      const categoriesResponse = await fetch('/api/categories');
      const categoriesData = await categoriesResponse.json();
      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }

      // Fetch unique brands from products
      const brandsResponse = await fetch('/api/products/brands');
      const brandsData = await brandsResponse.json();
      if (brandsData.success) {
        setBrands(brandsData.data);
      }
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key: keyof Filters, value: string | number | boolean | undefined) => {
    const newFilters = { ...filters };
    
    if (value === '' || value === null || value === undefined) {
      delete newFilters[key];
    } else {
      (newFilters as any)[key] = value;
    }
    
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Products
        </label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Search by product name..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-sm font-medium text-gray-900">Category</h3>
          {expandedSections.category ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>
        
        {expandedSections.category && (
          <div className="mt-3 space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={!filters.category}
                onChange={() => handleFilterChange('category', '')}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">All Categories</span>
            </label>
            {categories.map((category) => (
              <label key={category._id} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category.slug}
                  onChange={() => handleFilterChange('category', category.slug)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-sm font-medium text-gray-900">Brand</h3>
          {expandedSections.brand ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>
        
        {expandedSections.brand && (
          <div className="mt-3 space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="brand"
                checked={!filters.brand}
                onChange={() => handleFilterChange('brand', '')}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">All Brands</span>
            </label>
            {brands.map((brand) => (
              <label key={brand} className="flex items-center">
                <input
                  type="radio"
                  name="brand"
                  checked={filters.brand === brand}
                  onChange={() => handleFilterChange('brand', brand)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
          {expandedSections.price ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>
        
        {expandedSections.price && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min Price (৳)</label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max Price (৳)</label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="No limit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Quick Price Ranges */}
            <div className="space-y-2">
              <p className="text-xs text-gray-600">Quick Select:</p>
              {[
                { label: 'Under ৳1,000', min: 0, max: 1000 },
                { label: '৳1,000 - ৳5,000', min: 1000, max: 5000 },
                { label: '৳5,000 - ৳10,000', min: 5000, max: 10000 },
                { label: '৳10,000 - ৳25,000', min: 10000, max: 25000 },
                { label: 'Above ৳25,000', min: 25000, max: undefined },
              ].map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    handleFilterChange('minPrice', range.min);
                    handleFilterChange('maxPrice', range.max);
                  }}
                  className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 py-1"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Features Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('features')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-sm font-medium text-gray-900">Features</h3>
          {expandedSections.features ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>
        
        {expandedSections.features && (
          <div className="mt-3 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.featured || false}
                onChange={(e) => handleFilterChange('featured', e.target.checked || undefined)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Featured Products</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}