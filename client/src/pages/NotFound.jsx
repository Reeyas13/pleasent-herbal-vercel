import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Page Not Found</p>
      <button
        onClick={goToHome}
        className="px-6 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition duration-300"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
