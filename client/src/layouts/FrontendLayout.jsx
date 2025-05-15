import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCart, fetchCart, subCart } from '../store/cart';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Nav from '../components/frontend/Nav';
import { logout } from '../store/auth-slice';
import { FaTimes } from 'react-icons/fa';
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
    dispatch(logout());
  };

  return (
    <div className="relative">
      {/* Navbar with cart toggle */}
      <Nav toggleCart={toggleCart} />

      {/* Main content */}
      {/* <main className="container mx-auto p-4 md:p-6"> */}
        {children}
      {/* </main> */}

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed top-0 right-0 w-3/4 sm:w-1/3 h-full bg-white shadow-lg p-4 z-50 overflow-y-auto">
          {/* Close button */}
          <button
            onClick={toggleCart}
            className="absolute top-4 right-4 text-xl text-gray-600 hover:text-gray-900">
            <FaTimes />
          </button>
          
          {/* Cart title */}
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

          {/* Cart content */}
          {isLoading ? (
            <div>Loading cart...</div>
          ) : fetchError ? (
            <div className="text-red-500">Error loading cart items: {fetchError.message}</div>
          ) : cartItems.length > 0 ? (
            cartItems.map((item) => {
              const image = JSON.parse(item?.product?.imageUrls);
              return (
                <div key={item.id} className="flex items-center mb-4 border-b pb-4">
                  <img
                    src={image[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">Price: ${item?.product?.price}</p>
                    {item.message && (
                      <p className="text-red-500 text-sm mt-1">{item.message}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-green-500"
                      onClick={() => addToCart(item.id)}
                    >
                      +
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => removeFromCart(item.id)}
                    >
                      -
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500">No items in cart</div>
          )}

          {/* Checkout button */}
          {cartItems.length > 0 && (
            <Link
              to="/cart"
              className="w-full bg-blue-500 text-white py-3 mt-4 rounded-lg font-semibold hover:bg-blue-600"
            >
              Checkout
            </Link>
          )}

          {/* Logout button at the bottom */}
          <button
            onClick={logoutHandler}
            className="w-full mt-6 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default FrontendLayout;
