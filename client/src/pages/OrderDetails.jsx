import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../axios';
import FrontendLayout from '../layouts/FrontendLayout';
import CheckoutButton from './CheckoutButton';
// import FrontendLayout from '../components/la/FrontendLayout';

const fetchOrderDetails = async (id) => {
  const response = await api.post(`/api/overview/${id}`);
  return response.data;
};

const OrderDetails = () => {
  const { id } = useParams();
  const { data: order, isLoading, isError, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderDetails(id),
  });

  if (isLoading) return <div className="text-center mt-4">Loading...</div>;
  if (isError) return <div className="text-center mt-4 text-red-600">Error: {error.message}</div>;

  return (

    <div className="container mx-auto mt-8 p-4 mb-8 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold mb-4">Order Details</h1>
      {/* <form className="grid grid-cols-2 gap-4"> */}
        <div>
          <h2 className="text-xl font-medium mb-2">Product Information</h2>
          <label className="block mb-2">
            <span className="text-gray-600">Product Name</span>
            <input
              type="text"
              readOnly
              value={order?.products?.name || 'N/A'}
              className="mt-1 block w-full border-gray-300 rounded-md"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-600">Quantity</span>
            <input
              type="text"
              readOnly
              value={order.quantity}
              className="mt-1 block w-full border-gray-300 rounded-md"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-600">Total</span>
            <input
              type="text"
              readOnly
              value={`$${order.total}`}
              className="mt-1 block w-full border-gray-300 rounded-md"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-600">Shpping Status</span>
            <input
              type="text"
              readOnly
              value={order.status}
              className="mt-1 block w-full border-gray-300 rounded-md"
              />
          </label>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-2">Shipping Information</h2>
          <label className="block mb-2">
            <span className="text-gray-600">City</span>
            <input
              type="text"
              readOnly
              value={order.shipping.city.name}
              className="mt-1 block w-full border-gray-300 rounded-md"
            />
          </label>
          {/* <label className="block mb-2">
            <span className="text-gray-600">State</span>
            <input
              type="text"
              readOnly
              value={order.shipping.state}
              className="mt-1 block w-full border-gray-300 rounded-md"
              />
          </label> */}
          <label className="block mb-2">
            <span className="text-gray-600">Shipping Fee</span>
            <input
              type="text"
              readOnly
              value={`$${order.shipping.shippingFee}`}
              className="mt-1 block w-full border-gray-300 rounded-md"
              />
          </label>
          <label className="block mb-2">
            <span className="text-gray-600">Estimated Delivery</span>
            <input
              type="text"
              readOnly
              value={new Date(order.shipping.estimatedDelivery).toLocaleDateString()}
              className="mt-1 block w-full border-gray-300 rounded-md"
              />
          </label>
        </div>

        <div className="col-span-2">
          <h2 className="text-xl font-medium mb-2">Payment Information</h2>
          <label className="block mb-2">
            <span className="text-gray-600">Payment Type</span>
            <input
              type="text"
              readOnly
              value={order.payments.paymentType}
              className="mt-1 block w-full border-gray-300 rounded-md"
              />
          </label>
          {/* <label className="block mb-2">
            <span className="text-gray-600">Account No</span>
            <input
              type="text"
              readOnly
              value={order.payments.accountNo || 'N/A'}
              className="mt-1 block w-full border-gray-300 rounded-md"
              />
          </label> */}
         
          <label className="block mb-2">
            <span className="text-gray-600">Paid At</span>
            <input
              type="text"
              readOnly
              value={order.payments.paidAt ? new Date(order.payments.paidAt).toLocaleDateString() : 'Pending'}
              className="mt-1 block w-full border-gray-300 rounded-md"
            />
          </label>
        
        </div>
        {!(order.payments.amountPaid ) && (
            <CheckoutButton orderId={order.id} />
          )}
        {/* {(!order.payments.paidAt ) && (
          <div className="col-span-2 mt-4">
            <button
              type="button"
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              onClick={() => alert("Redirect to payment page")}
              >
              Pay Now
            </button>
          </div>
        )} */}
      {/* </form> */}
    </div>
  );
};

export default OrderDetails;
