import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCart, fetchCart, subCart } from '../store/cart';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Nav from '../components/frontend/Nav';
import { logout } from '../store/auth-slice';
import { FaTimes, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import Footer from '../components/frontend/Footer';

const FrontendLayout = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const dispatch = useDispatch();
  const { item: cartItems, quantity, total, isLoading, fetchError } = useSelector((state) => state.cart);

  // Toggle cart sidebar
  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  // Add to cart function
  const addToCart = async (itemId) => {
    dispatch(addCart(itemId)).then((result) => {
      toast.success(result.payload.message);
      dispatch(fetchCart());
    }).catch((err) => {
      console.log(err);
    });
  };

  // Remove from cart function
  const removeFromCart = async (itemId) => {
    dispatch(subCart(itemId)).then((result) => {
      toast.success(result.payload.message);
      dispatch(fetchCart());
    }).catch((err) => {
      console.log(err);
    });
  };

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Logout handler
 const logoutHandler = () => {
  setCartOpen(false); // Close the cart sidebar
  dispatch(logout());
};
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Navbar with cart toggle */}
      <Nav toggleCart={toggleCart} />

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Cart Sidebar Overlay */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleCart}></div>
      )}

      {/* Cart Sidebar */}
      <div className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${cartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        {/* Cart Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-2xl font-bold flex items-center">
            <FaShoppingCart className="mr-2 text-blue-600" />
            Your Cart
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <FaTimes className="text-gray-600 text-xl" />
          </button>
        </div>
        
        {/* Cart Content */}
        <div className="flex-grow overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : fetchError ? (
            <div className="text-red-500 p-4 text-center">Error loading cart items: {fetchError.message}</div>
          ) : cartItems.length > 0 ? (
            <div>
              {cartItems.map((item) => {
                const image = JSON.parse(item?.product?.imageUrls);
                return (
                  <div key={item.id} className="flex items-center mb-4 border-b pb-4 hover:bg-gray-50 rounded-lg p-2">
                    <img
                      src={process.env.REACT_APP_API_BASE_URL + image[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md shadow-sm mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.product.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="font-medium text-blue-600">${item?.product?.price.toFixed(2)}</p>
                      {item.message && (
                        <p className="text-red-500 text-sm mt-1">{item.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <button
                        className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow hover:bg-green-600 transition-colors"
                        onClick={() => addToCart(item.id)}
                      >
                        <FaPlus className="text-sm" />
                      </button>
                      <button
                        className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600 transition-colors"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FaMinus className="text-sm" />
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {/* Cart Summary */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-bold">${total ? total.toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Items:</span>
                  <span className="font-bold">{quantity}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <FaShoppingCart className="text-gray-300 text-5xl mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
            </div>
          )}
        </div>

        {/* Cart Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {cartItems.length > 0 && (
            <Link
              to="/cart"
              className="w-full block text-center bg-blue-600 text-white py-4 px-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-md"
              onClick={toggleCart}
            >
              Proceed to Checkout
            </Link>
          )}

          {/* Logout button */}
          <button
            onClick={logoutHandler}
            className="w-full mt-3 bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FrontendLayout;