// pages/PaymentFailure;.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                <h2 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h2>
                <p className="text-gray-700 mb-6">
                    Sorry, your payment could not be completed. Please try again.
                </p>
                <button
                    onClick={() => navigate('/checkout')}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    Retry Payment
                </button>
            </div>
        </div>
    );
};

export default PaymentFailure;
