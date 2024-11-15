import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { addCart, checkoutAll, fetchCart, subCart } from '../store/cart';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import FrontendLayout from '../layouts/FrontendLayout';
import { useQuery } from '@tanstack/react-query';
import api from '../axios';

const Checkout = () => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { item: cartItems, quantity, total, fetchError } = useSelector((state) => state.cart);

    // Fetching cities data using useQuery
    const { data: cities, isLoading: cityLoading, isError } = useQuery({
        queryKey: ['cities'], // Unique key for the query
        queryFn: async () => {
            const response = await api.get('/api/city'); // API endpoint to fetch cities
            return response.data;
        },
    });

    // Check if any item quantity exceeds available stock
    const isOverStock = cartItems.some((item) => item.quantity > item.product.stock);

    useEffect(() => {
        dispatch(fetchCart()).finally(() => setIsLoading(false));
    }, [dispatch]);

    const removeFromCart = async (itemId) => {
        dispatch(subCart(itemId))
            .then((result) => {
                toast.success(result.payload.message);
                dispatch(fetchCart());
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleCheckout = (data) => {
        const checkoutData = {
            ...data,
            cartItems,
            total,
        };

        dispatch(checkoutAll(checkoutData)).then(data => {
            if (data?.payload?.success) {
                toast.success('Order placed successfully!');
            }
        });
    };

    return (
        <FrontendLayout>
            <div className="container mx-auto p-4 md:p-6">
                <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

                {isLoading ? (
                    <div>Loading cart...</div>
                ) : fetchError ? (
                    <div className="text-red-500">Error loading cart items: {fetchError.message}</div>
                ) : cartItems.length > 0 ? (
                    <form onSubmit={handleSubmit(handleCheckout)}>
                        <div>
                            {cartItems.map((item) => {
                                const image = JSON.parse(item?.product?.imageUrls);
                                return (
                                    <div key={item.id} className="flex items-center mb-4 border-b pb-4">
                                        <img
                                            src={image[0]}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover mr-6"
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
                                                onClick={() => {
                                                    dispatch(addCart(item.id)).then((result) => {
                                                        if (result.payload.success) {
                                                            toast.success(result.payload.message);
                                                        }
                                                    });
                                                    dispatch(fetchCart());
                                                }}
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
                            })}

                            <div className="mt-6">
                                <div className="flex justify-between mb-4">
                                    <span className="font-semibold">Total Items:</span>
                                    <span>{quantity}</span>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <span className="font-semibold">Total Price before shipping:</span>
                                    <span>${total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping and Payment Form */}
                        <h2 className="text-xl font-semibold mt-6 mb-4">Shipping & Payment Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium">Address</label>
                                <input
                                    type="text"
                                    {...register("address", { required: "Address is required" })}
                                    className="w-full p-2 border rounded mt-1"
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-sm">{errors.address.message}</p>
                                )}
                            </div>

                            {/* Dropdown for City */}
                            <div>
                                <label className="block text-gray-700 font-medium">City</label>
                                <select
                                    {...register("city_id", { required: "City is required" })}
                                    className="w-full p-2 border rounded mt-1"
                                    disabled={cityLoading}
                                >
                                    <option value="">Select City</option>
                                    {cities?.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.city_id && (
                                    <p className="text-red-500 text-sm">{errors.city_id.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium">State</label>
                                <input
                                    type="text"
                                    {...register("state", { required: "State is required" })}
                                    className="w-full p-2 border rounded mt-1"
                                />
                                {errors.state && (
                                    <p className="text-red-500 text-sm">{errors.state.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium">Payment Type</label>
                                <select
                                    {...register("paymentType", { required: "Payment type is required" })}
                                    className="w-full p-2 border rounded mt-1"
                                >
                                    <option value="">Select Payment Type</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="paypal">PayPal</option>
                                    <option value="cod">Cash on Delivery</option>
                                </select>
                                {errors.paymentType && (
                                    <p className="text-red-500 text-sm">{errors.paymentType.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            type="submit"
                            disabled={isOverStock}
                            className={`w-full py-3 mt-6 rounded-lg font-semibold ${isOverStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                        >
                            Proceed to Checkout
                        </button>
                        {isOverStock && (
                            <p className="text-red-500 text-sm mt-2">Please adjust quantities to match available stock.</p>
                        )}
                    </form>
                ) : (
                    <div className="text-center text-gray-500">No items in cart</div>
                )}
            </div>
        </FrontendLayout>
    );
};

export default Checkout;
