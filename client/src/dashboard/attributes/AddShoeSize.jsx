import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../axios';
import toast, { Toaster } from 'react-hot-toast';

const AddShoeSize = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  // GET all sizes
  const { data: sizes = [] } = useQuery({
    queryKey: ['shoe-sizes'],
    queryFn: async () => {
      const res = await api.get('/api/shoe-sizes');
      return res.data;
    },
  });

  // POST size
  const { mutateAsync: addSize } = useMutation({
    mutationFn: async (data) => {
      return await api.post('/api/shoe-sizes', data);
    },
    onSuccess: () => {
      toast.success("Size added successfully!");
      queryClient.invalidateQueries(['shoe-sizes']);
      reset({ value: '' });
    },
    onError: (error) => {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    },
  });

  // DELETE size
  const { mutateAsync: deleteSize } = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/api/shoe-sizes/${id}`);
    },
    onSuccess: () => {
      toast.success("Size deleted");
      queryClient.invalidateQueries(['shoe-sizes']);
    },
    onError: (error) => {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    },
  });

  const onSubmit = async (data) => {
    await addSize(data);
  };

  return (
    <DashboardLayout>
      <Toaster />
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Manage Shoe Sizes</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
            <input
              type="text"
              {...register('value', { required: true })}
              placeholder="e.g. 8, 9.5, 10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Size
          </button>
        </form>

        <div className="bg-gray-50 rounded-md p-4">
          <h3 className="text-md font-medium text-gray-700 mb-3">Available Sizes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sizes.length === 0 ? (
              <p className="text-gray-500 italic">No sizes added yet</p>
            ) : (
              sizes.map((size) => (
                <div
                  key={size.id}
                  className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm"
                >
                  <span>{size.value}</span>
                  <button
                    onClick={() => deleteSize(size.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddShoeSize;
