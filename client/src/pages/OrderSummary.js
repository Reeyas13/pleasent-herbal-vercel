// pages/order-summary.js
import React from 'react';
import FrontendLayout from '../layouts/FrontendLayout';

const OrderSummary = () => {
  return (
    <FrontendLayout>

    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Order Summary</h1>
      <p>Your order is being processed. Thank you for shopping with us!</p>
    </div>
    </FrontendLayout>
  );
};

export default OrderSummary;
