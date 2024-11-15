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

  const { data: products = [], error, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/api/products/get/frontend');
      return response.data;
    },
  });

  const sortOptions = [
    { value: 'low-to-high', label: 'Price: Low to High' },
    { value: 'high-to-low', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest Arrivals' },
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (selectedOption) => {
    setSortOption(selectedOption);
  };

  const handleProductClick = (slug) => {
    navigate(`/products/${slug}`);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <FrontendLayout>
      <h1 className="text-3xl font-bold mb-6 text-center">Our Products</h1>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 w-[90%] mx-auto">
        {/* Search Bar */}
        <div className="flex items-center border p-2 rounded-lg w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 w-full sm:w-64 focus:outline-none"
          />
          <FaSearch className="h-5 w-5 text-gray-500 ml-2" />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center w-full sm:w-auto">
          <FaFilter className="text-gray-500 mr-2" />
          <Select
          // isMulti={true}
            options={sortOptions}
            value={sortOption}
            onChange={handleSortChange}
            placeholder="Sort by"
            className="w-full sm:w-48"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const images = JSON.parse(product.imageUrls);

          return (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.slug)}
              className="border rounded-lg p-4 flex flex-col items-center text-center shadow-lg cursor-pointer transform transition duration-200 hover:scale-105"
            >
              <div className="h-44 w-full bg-gray-200 mb-4 rounded-lg flex items-center justify-center overflow-hidden">
                {/* Cloudinary URL with aspect ratio transformation */}
                <img
                  src={`${images[0]}`}
                  alt={product.name}
                  className="object-contain h-full w-full rounded-lg"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-700 mb-2">${product.price}</p>
            </div>
          );
        })}
      </div>
    </FrontendLayout>
  );
};

export default ProductsPage;
