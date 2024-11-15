import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthenticated = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold mb-4">Access Denied</h1>
      <p className="mb-6 text-gray-700">You need to be logged in to access this page.</p>
      <button
        onClick={goToHome}
        className="px-6 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition duration-300"
      >
        Go to Home
      </button>
    </div>
  );
};

export default Unauthenticated;
