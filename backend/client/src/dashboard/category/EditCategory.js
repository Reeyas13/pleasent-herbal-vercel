import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../axios";

const Edit = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // Fetch existing category data
  const { data: category, isLoading: isFetching } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const response = await api.get(`/api/category/${slug}`);
      console.log(response.data)
      return response.data;
    },
    onSuccess: (data) => {
      // Set form values with the fetched data
      setValue("title", data.name);
      setValue("description", data.description);
    },
    onError: (error) => {
      toast.error(`Error fetching category: ${error.message}`);
    },
    enabled: !!slug,
  });

  // Mutation to update the category
  const { mutateAsync: updateCategory, isLoading: isSubmitting } = useMutation({
    mutationFn: async (data) => {
      return await api.put(`/api/category/${slug}`, {
        name: data.title,
        description: data.description,
      });
    },
    onSuccess: () => {
      toast.success("Category updated successfully!");
      navigate("/admin/categories");
    },
    onError: (error) => {
      toast.error(`Error updating category: ${error.response?.data || error.message}`);
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    await updateCategory(data);
  };

  useEffect(() => {
    if (category) {
      // Populate the form with existing product data
      setValue('title', category.name);
      setValue('description', category.description);
   // Adjust based on your product structure
    }
  }, [category, setValue]);

  return (
    <DashboardLayout>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Edit Category
        </h2>

        {isFetching ? (
          <p className="text-center text-gray-600">Loading category data...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-gray-600 font-medium mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-red-500 italic">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-gray-600 font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                {...register("description", { required: "Description is required" })}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 italic">{errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Edit;
