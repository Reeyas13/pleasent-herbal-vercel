import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../axios"; // Adjust the path based on your file structure
import DashboardLayout from "../../layouts/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductAdd = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories using useQuery
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/api/category");
      return response.data; // Adjust based on your API response structure
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Mutation to add a product
  const mutation = useMutation({
    mutationFn: async (formData) => {
      setSubmitting(true);
      const response = await axios.post(
        "http://localhost:8000/api/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Product added successfully!");
      navigate("/add/products");
      queryClient.invalidateQueries(["products"]); // Update the query key accordingly
    },

    onError: (error) => {
      console.log({ error: error });
      toast.error(`Error adding product: ${error.message}`);
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("featured", data.featured);
    // Array.from(data.images).forEach((file) => {
    //   formData.append("images", file);
    // });

    if (data.images && data.images.length) {
      Array.from(data.images).forEach((file) =>
        formData.append("images", file)
      );
    }

    // Handle multiple images

    formData.append("category_id", data.category);

    mutation.mutate(formData); // Trigger the mutation with form data
  };

  return (
    <DashboardLayout>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Add Product
        </h2>
        {isLoading && <p>Loading categories...</p>}
        {error && <p className="text-red-500">Error loading categories</p>}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          encType="multipart/form-data"
        >
          {/* Name Field */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}
          </div>

          {/* Price Field */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Price
            </label>
            <input
              type="number"
              {...register("price", { required: "Price is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.price && (
              <span className="text-red-500">{errors.price.message}</span>
            )}
          </div>

          {/* Stock Field */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Stock
            </label>
            <input
              type="number"
              {...register("stock", { required: "Stock is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.stock && (
              <span className="text-red-500">{errors.stock.message}</span>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              featured
            </label>
            <input
              type="checkbox"
              {...register("featured")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.featured && (
              <span className="text-red-500">{errors.featured.message}</span>
            )}
          </div>

          {/* Images Field */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Images
            </label>
            <input
              type="file"
              multiple
              {...register("images", {
                required: "At least one image is required",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.images && (
              <span className="text-red-500">{errors.images.message}</span>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Category
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}{" "}
                  {/* Adjust based on your category structure */}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-red-500">{errors.category.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-md"
            >
              {submitting ? "Submitting..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProductAdd;
