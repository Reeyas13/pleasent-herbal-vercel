import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../axios';
import toast, { Toaster } from 'react-hot-toast';

const AddShoeBrand = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, setValue, reset } = useForm();

  const nameValue = watch('name');

  // Auto-generate slug
  React.useEffect(() => {
    const generatedSlug = nameValue
      ?.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    setValue('slug', generatedSlug);
  }, [nameValue, setValue]);

  // Fetch brands
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['shoe-brands'],
    queryFn: async () => {
      const res = await api.get('/api/shoe-brands');
      return res.data;
    },
  });

  // Create brand
  const createBrand = useMutation({
    mutationFn: async (formData) => {
      const res = await api.post('/api/shoe-brands', formData);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Brand added!');
      queryClient.invalidateQueries(['shoe-brands']);
      reset();
    },
    onError: () => {
      toast.error('Failed to add brand');
    },
  });

  // Delete brand
  const deleteBrand = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/shoe-brands/${id}`);
    },
    onSuccess: () => {
      toast.success('Brand deleted!');
      queryClient.invalidateQueries(['shoe-brands']);
    },
    onError: () => {
      toast.error('Failed to delete brand');
    },
  });

  const onSubmit = (data) => {
    createBrand.mutate(data);
  };

  return (
    <DashboardLayout>
      <Toaster />
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Manage Shoe Brands</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
            <input
              {...register('name', { required: true })}
              placeholder="e.g. Puma"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Slug</label>
            <input
              {...register('slug', { required: true })}
              placeholder="e.g. puma"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">URL-friendly version of the brand name</p>
          </div>

          <button
            type="submit"
            disabled={createBrand.isPending}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            {createBrand.isPending ? 'Adding...' : 'Add Brand'}
          </button>
        </form>

        <div className="bg-gray-50 rounded-md p-4">
          <h3 className="text-md font-medium text-gray-700 mb-3">Available Brands</h3>
          <div className="space-y-2">
            {isLoading ? (
              <p className="text-gray-500 italic">Loading brands...</p>
            ) : brands.length === 0 ? (
              <p className="text-gray-500 italic">No brands added yet</p>
            ) : (
              brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm"
                >
                  <div>
                    <div className="font-medium">{brand.name}</div>
                    <div className="text-sm text-gray-500">/{brand.slug}</div>
                  </div>
                  <button
                    onClick={() => deleteBrand.mutate(brand.id)}
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

export default AddShoeBrand;
