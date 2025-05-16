import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../axios';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState(null);

    // Retrieve productId and quantity from location state
    const { productId, quantity, productSlug } = location.state || {};
    
    // Fetch product details
    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', productId],
        queryFn: async () => {
            const response = await api.get(`/api/products/${productSlug}`);
            return response.data;
        },
    });

    // Parse product URLs and get the first image URL
    const imageUrls = product && JSON.parse(product.imageUrls);
    const mainImage = imageUrls ? imageUrls[0] : '';

    const { register, handleSubmit, formState: { errors } } = useForm();

    const mutation = useMutation({
        mutationFn: async (data) => {
            // Make the API request to add to cart
            const response = await api.post('/api/order', data, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            // Show success notification
            toast.success('Order submitted successfully!');
            // Navigate to a success or confirmation page
            navigate('/overview');
        },
        onError: (error) => {
            // Show error notification
            toast.error(`Error submitting order: ${error.response?.data || error.message}`);
            console.error('Error submitting order:', error.response?.data || error.message);
        },
    });

    const onSubmit = async (data) => {
        // Prepare the order data
        const orderData = {
            productId,
            quantity,
            ...data, // Spread the address and payment type data
        };

        mutation.mutate(orderData);
    };

    // Fetch all cities
    const { data: cities, isLoading: cityLoading, isError } = useQuery({
        queryKey: ['cities'], // Unique key for the query
        queryFn: async () => {
            const response = await api.get('/api/city'); // API endpoint to fetch cities
            return response.data;
        },
    });

    return (
        <div className="max-w-md mx-auto py-8">
            <h2 className="text-2xl font-bold mb-4">Checkout</h2>
            {product && (
                <div className="flex mb-4">
                    <img src={process.env.REACT_APP_API_BASE_URL+mainImage} alt={product.name} className="w-16 h-16 object-cover rounded mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-600">Quantity: {quantity}</p>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block mb-1">Address:</label>
                    <input
                        type="text"
                        {...register('address', { required: 'Address is required' })}
                        className="w-full border rounded p-2"
                    />
                    {errors.address && <p className="text-red-500">{errors.address.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block mb-1">City:</label>
                    <select
                        {...register('city_id', { required: 'City is required' })}
                        className="w-full border rounded p-2"
                    >
                        <option value="">Select a city</option>
                        {cities?.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                    {errors.city_id && <p className="text-red-500">{errors.city_id.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block mb-1">State:</label>
                    <input
                        type="text"
                        {...register('state', { required: 'State is required' })}
                        className="w-full border rounded p-2"
                    />
                    {errors.state && <p className="text-red-500">{errors.state.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Payment Type:</label>
                    <select
                        {...register('paymentType', { required: 'Payment type is required' })}
                        className="w-full border rounded p-2"
                    >
                        <option value="">Select a payment method</option>
                        <option value="credit">Credit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="cash">Cash on Delivery</option>
                    </select>
                    {errors.paymentType && <p className="text-red-500">{errors.paymentType.message}</p>}
                </div>

                <button 
                    type="submit" 
                    className={`bg-gray-900 text-white py-2 px-4 rounded-full ${mutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={mutation.isLoading}
                >
                    {mutation.isLoading ? 'Submitting...' : 'Submit Order'}
                </button>
            </form>
            {mutation.isError && <p className="text-red-500 mt-4">Error submitting order. Please try again.</p>}
        </div>
    );
};

export default CheckoutPage;
