import React from 'react';
import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import OrderOverviewTable from './OrderOverviewTable';
import FrontendLayout from '../layouts/FrontendLayout';
import OrderOverviewTable from '../components/frontend/OrderOverviewTable';
import api from '../axios';
import Loader from '../components/Loader';

const fetchOrders = async () => {
  const response = await api.post('/api/overview');
  return response.data;
};

const OverviewPage = () => {
  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
   
      <div className='w-[95%] mx-auto'>

      <h1 className='text-4xl text-blue-700 font-semibold'>Order Overview</h1>
      <OrderOverviewTable orders={orders} />
      </div>
  );
};

export default OverviewPage;
