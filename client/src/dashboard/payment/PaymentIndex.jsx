import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../axios';

const PaymentTable = () => {
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    // Fetch data from the API
    api.get('/api/admin/payment')
      .then(response => {
        setPayments(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the payments data:", error);
      });
  }, []);

  // Calculate the current payments to display based on the page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = payments.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <DashboardLayout>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Username</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Type of Payment</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Transaction Code</th>
              <th className="py-2 px-4 border-b">Signature</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.map((payment) => (
              <tr key={payment.id} className="text-center">
                <td className="py-2 px-4 border-b">{payment.user.name}</td>
                <td className="py-2 px-4 border-b">{payment.amount || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{payment.typeOfPayment}</td>
                <td className="py-2 px-4 border-b">{payment.status}</td>
                <td className="py-2 px-4 border-b">{payment.transaction_code || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{payment.signature || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: Math.ceil(payments.length / itemsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(payments.length / itemsPerPage)}
          className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </DashboardLayout>
  );
};

export default PaymentTable;
