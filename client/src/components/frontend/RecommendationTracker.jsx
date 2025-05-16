import React, { useEffect } from 'react';
import api from '../../axios';
import { Link } from 'react-router-dom';

/**
 * RecommendationComponents.js - Implements UI components for the recommendation system
 * 
 * These components interface with the recommendation API endpoints to provide:
 * - Product view tracking
 * - Personalized product recommendations
 * - Similar product recommendations
 * - Popular products display
 * - Purchase-based recommendations
 */

// Recommendation Tracker Component - invisible component that tracks product views
export const RecommendationTracker = ({ userId, productId }) => {
  useEffect(() => {
    const trackView = async () => {
      try {
        await api.post('/api/recommendation/track-view', {
          userId,
          productId
        });
        console.log('Product view tracked successfully');
      } catch (error) {
        console.error('Error tracking product view:', error);
      }
    };

    if (userId && productId) {
      trackView();
    }
  }, [userId, productId]);

  // This component doesn't render anything visible
  return null;
};

// Reusable Product Card Component
const ProductCard = ({ product }) => {
  let images = [];
  try {
    images = JSON.parse(product.imageUrls);
  } catch (e) {
    // If parsing fails, assume it's already an array or handle the error
    images = Array.isArray(product.imageUrls) ? product.imageUrls : ['/placeholder.jpg'];
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="w-full bg-white shadow-md rounded-xl duration-300 hover:scale-105 hover:shadow-xl"
    >
      <img 
        src={`${process.env.REACT_APP_API_BASE_URL}${images[0]}`}
        alt={product.name} 
        className="h-64 w-full object-cover rounded-t-xl"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-black truncate block capitalize">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-semibold text-black">Rs {product.price}</p>
          {product.featured && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              Featured
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};