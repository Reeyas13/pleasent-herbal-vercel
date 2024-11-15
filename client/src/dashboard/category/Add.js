import React from "react";
// import DashboardLayout from "../../components/backend/DashboardLayout";
import { useForm } from "react-hook-form";
import api from "../../axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import DashboardLayout from "../../layouts/DashboardLayout";

const Add = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Use the mutation for adding a category
  const { mutateAsync: mutateAsyncCreateCategory } = useMutation({
    mutationFn: async (data) => {
      return await api.post("/api/category", {
        name: data.title,
        description: data.description,
      });
    },
    onSuccess: () => {
      toast.success("Category added successfully!");
      // setTimeout(() => {
        navigate("/admin/categories");
      // }, 1500); // Redirect after showing success toast
    },
    onError: (error) => {
      toast.error(`Error adding category: ${error.response?.data || error.message}`);
      console.error('Error adding category:', error.response?.data || error.message);
    },
  });

  // Update onSubmit to use the mutation
  const onSubmit = async (data) => {
    await mutateAsyncCreateCategory(data);
  };

  return (
    <DashboardLayout>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Add Category
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              {...register("title", { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 italic">This field is required</p>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Description
            </label>
            <textarea
              {...register("description", { required: true })}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 italic">This field is required</p>
            )}
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Add;
