import React, { useState, useEffect } from 'react';
import { FaCross, FaXRay } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../axios';
import toast, { Toaster } from 'react-hot-toast';

const AddShoeColor = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  // GET all colors
  const { data: colors = [], refetch } = useQuery({
    queryKey: ['shoe-colors'],
    queryFn: async () => {
      const res = await api.get('/api/shoe-colors');
      return res.data;
    },
  });

  // POST color
  const { mutateAsync: addColor } = useMutation({
    mutationFn: async (data) => {
      return await api.post('/api/shoe-colors', data);
    },
    onSuccess: () => {
      toast.success("Color added successfully!");
      queryClient.invalidateQueries(['shoe-colors']);
      reset({ name: '', hexCode: '#000000' });
    },
    onError: (error) => {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    },
  });

  // DELETE color
  const { mutateAsync: deleteColor } = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/api/shoe-colors/${id}`);
    },
    onSuccess: () => {
      toast.success("Color deleted");
      queryClient.invalidateQueries(['shoe-colors']);
    },
    onError: (error) => {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    },
  });

  const onSubmit = async (data) => {
    await addColor(data);
  };

  return (
    <DashboardLayout>
      <Toaster />
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Manage Shoe Colors</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color Name</label>
              <input
                type="text"
                {...register('name', { required: true })}
                placeholder="e.g. Navy Blue"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color Hex Code</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  {...register('hexCode')}
                  defaultValue="#000000"
                  className="h-10 w-10 border-0 rounded p-0"
                />
                <input
                  type="text"
                  {...register('hexCode')}
                  defaultValue="#000000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Color
          </button>
        </form>

        <div className="bg-gray-50 rounded-md p-4">
          <h3 className="text-md font-medium text-gray-700 mb-3">Available Colors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {colors.length === 0 ? (
              <p className="text-gray-500 italic">No colors added yet</p>
            ) : (
              colors.map((color) => (
                <div
                  key={color.id}
                  className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hexCode }}
                    />
                    <span>{color.name}</span>
                    <span className="text-xs text-gray-500">{color.hexCode}</span>
                  </div>
                  <button
                    onClick={() => deleteColor(color.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaCross className="w-5 h-5" />
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

export default AddShoeColor;
