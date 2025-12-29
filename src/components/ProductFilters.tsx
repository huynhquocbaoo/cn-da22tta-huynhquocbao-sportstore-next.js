'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface Category {
  name: string;
  value: string;
  count: number;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 5000000;

interface ProductFiltersProps {
  categories: Category[];
  brands: string[];
  selectedCategory: string;
  selectedBrands: string[];
  priceRange: [number, number];
  onCategoryChange: (category: string) => void;
  onBrandsChange: (brands: string[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
}

export default function ProductFilters({
  categories,
  brands,
  selectedCategory,
  selectedBrands,
  priceRange,
  onCategoryChange,
  onBrandsChange,
  onPriceRangeChange
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    price: true
  });
  const [priceInputs, setPriceInputs] = useState({
    min: priceRange[0].toString(),
    max: priceRange[1].toString()
  });
  const [activePriceField, setActivePriceField] = useState<null | 'min' | 'max'>(null);

  useEffect(() => {
    if (activePriceField) return;
    setPriceInputs({
      min: priceRange[0].toString(),
      max: priceRange[1].toString()
    });
  }, [priceRange[0], priceRange[1], activePriceField]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBrandToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter(b => b !== brand));
    } else {
      onBrandsChange([...selectedBrands, brand]);
    }
  };

  const handlePriceInputChange = (field: 'min' | 'max', value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setPriceInputs(prev => {
        const updated = { ...prev, [field]: value };
        const minValue = updated.min === '' ? DEFAULT_MIN_PRICE : Number(updated.min);
        const maxValue = updated.max === '' ? DEFAULT_MAX_PRICE : Number(updated.max);

        onPriceRangeChange([minValue, maxValue]);
        return updated;
      });
    }
  };

  const applyPriceRange = (min: number, max: number) => {
    onPriceRangeChange([min, max]);
    setPriceInputs({
      min: min.toString(),
      max: max.toString()
    });
    setActivePriceField(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
        <button
          onClick={() => {
            onCategoryChange('all');
            onBrandsChange([]);
            applyPriceRange(DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE);
          }}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          <span>Danh mục</span>
          <ChevronDown 
            className={`h-4 w-4 transition-transform ${
              expandedSections.category ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {expandedSections.category && (
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.value} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category.value}
                    checked={selectedCategory === category.value}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">{category.name}</span>
                </div>
                <span className="text-sm text-gray-500">({category.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          <span>Thương hiệu</span>
          <ChevronDown 
            className={`h-4 w-4 transition-transform ${
              expandedSections.brand ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {expandedSections.brand && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">{brand}</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          <span>Khoảng giá</span>
          <ChevronDown 
            className={`h-4 w-4 transition-transform ${
              expandedSections.price ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {expandedSections.price && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={priceInputs.min}
                onChange={(e) => handlePriceInputChange('min', e.target.value)}
                onFocus={() => setActivePriceField('min')}
                onBlur={() => setActivePriceField(null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                placeholder="Từ"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                value={priceInputs.max}
                onChange={(e) => handlePriceInputChange('max', e.target.value)}
                onFocus={() => setActivePriceField('max')}
                onBlur={() => setActivePriceField(null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                placeholder="Đến"
              />
            </div>
            
            <div className="text-sm text-gray-600">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </div>

            {/* Quick Price Filters */}
            <div className="space-y-2">
              <button
                onClick={() => applyPriceRange(0, 500000)}
                className="block w-full text-left text-sm text-gray-700 hover:text-blue-600"
              >
                Dưới {formatPrice(500000)}
              </button>
              <button
                onClick={() => applyPriceRange(500000, 1000000)}
                className="block w-full text-left text-sm text-gray-700 hover:text-blue-600"
              >
                {formatPrice(500000)} - {formatPrice(1000000)}
              </button>
              <button
                onClick={() => applyPriceRange(1000000, 2000000)}
                className="block w-full text-left text-sm text-gray-700 hover:text-blue-600"
              >
                {formatPrice(1000000)} - {formatPrice(2000000)}
              </button>
              <button
                onClick={() => applyPriceRange(2000000, 5000000)}
                className="block w-full text-left text-sm text-gray-700 hover:text-blue-600"
              >
                {formatPrice(2000000)} - {formatPrice(5000000)}
              </button>
              <button
                onClick={() => applyPriceRange(5000000, 10000000)}
                className="block w-full text-left text-sm text-gray-700 hover:text-blue-600"
              >
                Trên {formatPrice(5000000)}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {(selectedCategory !== 'all' || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000000) && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Bộ lọc đang áp dụng:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                {categories.find(c => c.value === selectedCategory)?.name}
                <button
                  onClick={() => onCategoryChange('all')}
                  className="ml-2 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {selectedBrands.map((brand) => (
              <span key={brand} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                {brand}
                <button
                  onClick={() => handleBrandToggle(brand)}
                  className="ml-2 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            
            {(priceRange[0] > 0 || priceRange[1] < 5000000) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                <button
                  onClick={() => onPriceRangeChange([0, 5000000])}
                  className="ml-2 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
