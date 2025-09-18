'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface ProductSortProps {
  sortBy: string;
  sortOrder: string;
  onSortChange: (sort: string, order: string) => void;
}

const sortOptions = [
  { value: 'createdAt-desc', label: 'Newest First', sort: 'createdAt', order: 'desc' },
  { value: 'createdAt-asc', label: 'Oldest First', sort: 'createdAt', order: 'asc' },
  { value: 'price-asc', label: 'Price: Low to High', sort: 'price', order: 'asc' },
  { value: 'price-desc', label: 'Price: High to Low', sort: 'price', order: 'desc' },
  { value: 'name-asc', label: 'Name: A to Z', sort: 'name', order: 'asc' },
  { value: 'name-desc', label: 'Name: Z to A', sort: 'name', order: 'desc' },
  { value: 'rating-desc', label: 'Highest Rated', sort: 'rating', order: 'desc' },
  { value: 'rating-asc', label: 'Lowest Rated', sort: 'rating', order: 'asc' },
];

export default function ProductSort({ sortBy, sortOrder, onSortChange }: ProductSortProps) {
  const currentValue = `${sortBy}-${sortOrder}`;
  const currentOption = sortOptions.find(option => option.value === currentValue);

  const handleSortChange = (value: string) => {
    const option = sortOptions.find(opt => opt.value === value);
    if (option) {
      onSortChange(option.sort, option.order);
    }
  };

  return (
    <div className="relative">
      <select
        value={currentValue}
        onChange={(e) => handleSortChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}