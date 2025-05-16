// ProductsPage.js
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
import FrontendLayout from '../layouts/FrontendLayout';

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState(null);
  const navigate = useNavigate();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/api/products/get/frontend').then(res => res.data),
  });

  const sortOptions = [
    { value: 'low-to-high', label: 'Price: Low to High' },
    { value: 'high-to-low', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest Arrivals' },
  ];

  const handleSearchChange = e => setSearchTerm(e.target.value);
  const handleSortChange = opt => setSortOption(opt);
  const handleProductClick = slug => navigate(`/products/${slug}`);

  const filtered = products
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (!sortOption) return 0;
      if (sortOption.value === 'low-to-high') return a.price - b.price;
      if (sortOption.value === 'high-to-low') return b.price - a.price;
      if (sortOption.value === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  return (
    <FrontendLayout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Our Products
        </h1>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <div className="flex items-center w-full sm:w-1/2 bg-white border rounded-lg shadow-sm px-4 py-2">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full focus:outline-none"
            />
          </div>

          <div className="flex items-center w-full sm:w-1/3 bg-white border rounded-lg shadow-sm px-4 py-2">
            <FaFilter className="text-gray-400 mr-2" />
            <Select
              options={sortOptions}
              value={sortOption}
              onChange={handleSortChange}
              placeholder="Sort by"
              className="w-full text-sm"
              styles={{
                control: (base) => ({ ...base, border: 'none', boxShadow: 'none' }),
              }}
            />
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map(product => {
              const images = JSON.parse(product.imageUrls);
              return (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.slug)}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col"
                >
                  <div className="relative h-56 bg-gray-100">
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}${images[0]}`}
                      alt={product.name}
                      className="object-contain h-full w-full"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h2>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-600">${product.price}</span>
                      <button className="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </FrontendLayout>
  );
};

export default ProductsPage;
