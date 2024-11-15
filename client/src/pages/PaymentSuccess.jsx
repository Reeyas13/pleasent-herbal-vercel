import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    const transactionCode = queryParams.get('transaction_code');
    const transactionUuid = queryParams.get('transaction_uuid');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                <h2 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h2>
                <p className="text-gray-700 mb-6">
                    Thank you for your payment. Your transaction has been completed successfully.
                </p>
                <p className="text-gray-700 mb-4">
                    <strong>Transaction Code:</strong> {transactionCode || 'N/A'}
                </p>
                <p className="text-gray-700 mb-6">
                    <strong>Transaction UUID:</strong> {transactionUuid || 'N/A'}
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
