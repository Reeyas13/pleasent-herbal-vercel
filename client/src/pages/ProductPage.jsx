import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import api from '../axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import FrontendLayout from '../layouts/FrontendLayout';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addCart, addItemToCart, addToCart, fetchCart } from '../store/cart';

const ProductPage = () => {
    const dispatch = useDispatch();
    const { slug } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate
    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', slug],
        queryFn: async () => {
            const response = await api.get(`/api/products/${slug}`);
            console.log(response)
            return response.data;
        },
    });

    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState('');

    // const { mutateAsync: mutateAsyncAddToCart } = useMutation({
    //     mutationFn: async (data) => {
    //         const response = await api.post('/api/cart', data);
    //         return response.data;
    //     },
    //     onSuccess: () => {
    //         toast.success('Product added to cart');
    //     },
    //     onError: (error) => {
    //         toast.error(`Error adding product to cart: ${error.response?.data || error.message}`);
    //         console.error('Error adding product to cart:', error.response?.data || error.message);
    //     },
    // });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading product details</div>;

    const imageUrls = JSON.parse(product.imageUrls);

    // Set initial main image
    if (!mainImage) setMainImage(imageUrls[0]);

    async function handleAddToCart(productId, quantity) {
        console.log("clicked")
        console.log({productId, quantity})
        dispatch(addToCart({data: { productId, quantity }})).then((result) => {
            console.log(result);
            toast.success(result.payload.message);
            dispatch(fetchCart());
        });
        // dispatch((addCart(itemId))).then((result) => {
        //   console.log(result);
        //   toast.success(result.payload.message);
        //   dispatch(fetchCart());
        // }).catch((err) => {
        //   console.log(err);
        // });
    
    
      }
    const handleQuantityChange = (type) => {
        setQuantity((prev) => {
            if (type === 'increment') return prev + 1;
            if (type === 'decrement') return prev > 1 ? prev - 1 : 1;
            return prev;
        });
    };

    const handleCheckout = () => {
        navigate('/checkout', { state: { productId: product.id, quantity,productSlug: product.slug } }); // Pass productId and quantity to CheckoutPage
    };

    return (
        <FrontendLayout>
            <div className="bg-gray-100 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row -mx-4">
                        {/* Product Image Section */}
                        <div className="md:w-1/2 px-4">
                            <div className="h-[460px] rounded-lg bg-gray-300 mb-4">
                                <img
                                    className="w-full h-full object-cover rounded-lg"
                                    src={process.env.REACT_APP_API_BASE_URL+mainImage}
                                    alt={product.name}
                                />
                            </div>
                            <div className="flex mt-4 space-x-2">
                                {imageUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={process.env.REACT_APP_API_BASE_URL+url}
                                        alt={`${product.name} image ${index + 1}`}
                                        className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                                        onClick={() => setMainImage(url)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Product Details Section */}
                        <div className="md:w-1/2 px-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
                            <p className="text-gray-600 text-sm mb-4">{product.description}</p>

                            <div className="flex items-center mb-4">
                                <span className="font-bold text-gray-700 mr-2">Price:</span>
                                <span className="text-gray-600 text-lg">${product.price}</span>
                            </div>

                            <div className="flex items-center mb-4">
                                <span className="font-bold text-gray-700 mr-2">Stock:</span>
                                <span className="text-gray-600">{product.stock} available</span>
                            </div>

                            <div className="mb-4">
                                <span className="font-bold text-gray-700">Category:</span>
                                <p className="text-gray-600">{product.categories.name}</p>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-6 flex items-center">
                                <span className="font-bold text-gray-700 mr-2">Quantity:</span>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleQuantityChange('decrement')}
                                        className="px-3 py-1 rounded bg-gray-300 font-bold text-gray-700"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        readOnly
                                        className="w-12 text-center border rounded"
                                    />
                                    <button
                                        onClick={() => handleQuantityChange('increment')}
                                        className="px-3 py-1 rounded bg-gray-300 font-bold text-gray-700"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4">
                                <button
                                    onClick={()=>handleAddToCart(product.id,quantity)}
                                    className="w-full bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800"
                                >
                                    Add to Cart dgfs
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-full font-bold hover:bg-green-500"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
};

export default ProductPage;
