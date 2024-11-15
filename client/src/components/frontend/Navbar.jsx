// Navbar.js
import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = ({ toggleCart }) => {
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold cursor-pointer">Shop</h1>
      <button onClick={toggleCart} className="relative">
        <FaShoppingCart className="h-6 w-6" />
        {/* Cart badge (optional) */}
        <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full px-1 text-white">3</span>
      </button>
    </nav>
  );
};

export default Navbar;
