import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProductAdd = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Fetch shoe categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["shoeCategories"],
    queryFn: async () => {
      const response = await api.get("/api/category");
      return response.data;
    },
  });

  // Fetch shoe sizes
  const { data: sizes = [], isLoading: sizesLoading } = useQuery({
    queryKey: ["shoeSizes"],
    queryFn: async () => {
      const response = await api.get("/api/shoe-sizes");
      return response.data;
    },
  });

  // Fetch shoe colors
  const { data: colors = [], isLoading: colorsLoading } = useQuery({
    queryKey: ["shoeColors"],
    queryFn: async () => {
      const response = await api.get("/api/shoe-colors");
      return response.data;
    },
  });

  // Fetch shoe brands
  const { data: brands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ["shoeBrands"],
    queryFn: async () => {
      const response = await api.get("/api/shoe-brands");
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Mutation to add a shoe product
  const mutation = useMutation({
    mutationFn: async (formData) => {
      setSubmitting(true);
      const response = await api.post("api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Shoe product added successfully!");
      navigate("/admin/products");
      queryClient.invalidateQueries(["shoes"]);
    },
    onError: (error) => {
      toast.error(`Error adding shoe: ${error.message}`);
    },
    onSettled: () => setSubmitting(false),
  });

  const onSubmit = (data) => {
    // Ensure selectedSizes and selectedColors are arrays
    const selectedSizes = Array.isArray(data.selectedSizes)
      ? data.selectedSizes
      : data.selectedSizes
      ? [data.selectedSizes]
      : [];
    const selectedColors = Array.isArray(data.selectedColors)
      ? data.selectedColors
      : data.selectedColors
      ? [data.selectedColors]
      : [];

    // Validate that at least one size and color are selected
    if (selectedSizes.length === 0 || selectedColors.length === 0) {
      toast.error("Please select at least one size and one color");
      return;
    }

    // Construct inventory array and calculate total stock
    const inventory = [];
    let totalStock = 0;
    selectedSizes.forEach((sizeId) => {
      selectedColors.forEach((colorId) => {
        const stockValue = data[`stock_${sizeId}_${colorId}`];
        const stock = stockValue ? parseInt(stockValue, 10) : 0;
        inventory.push({
          size_id: sizeId,
          color_id: colorId,
          stock: stock,
        });
        totalStock += stock;
      });
    });

    // Prepare form data
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("stock", totalStock.toString()); // Add total stock
    formData.append("category_id", data.category);
    formData.append("brand_id", data.brand);
    formData.append("featured", data.featured ? "true" : "false");
    formData.append("releaseYear", data.releaseYear);
    formData.append("material", data.material);
    formData.append("gender", data.gender);
    formData.append("inventory", JSON.stringify(inventory)); // Include inventory for future use

    // Handle style tags
    if (data.styleTags) {
      const tags = data.styleTags.split(",").map((tag) => ({
        name: tag.trim(),
        weight: 1.0,
      }));
      formData.append("tags", JSON.stringify(tags));
    }

    // Handle multiple images
    if (data.images && data.images.length) {
      Array.from(data.images).forEach((file) => formData.append("images", file));
    }

    mutation.mutate(formData);
  };

  const isLoading = categoriesLoading || sizesLoading || colorsLoading || brandsLoading;

  return (
    <DashboardLayout>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Add New Shoe Product
        </h2>

        {isLoading && <p className="text-center text-blue-500">Loading shoe data...</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register("description", { required: "Description is required" })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              step="0.01"
              {...register("price", { required: "Price is required", min: 0 })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              {...register("category", { required: "Category is required" })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand</label>
            <select
              {...register("brand", { required: "Brand is required" })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {errors.brand && <p className="text-red-500 text-sm">{errors.brand.message}</p>}
          </div>

          {/* Sizes and Colors with Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Sizes</label>
            {sizes.map((size) => (
              <div key={size.id} className="flex items-center">
                <input
                  type="checkbox"
                  value={size.id}
                  {...register("selectedSizes")}
                  className="mr-2"
                />
                <span>{size.value}</span>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Colors</label>
            {colors.map((color) => (
              <div key={color.id} className="flex items-center">
                <input
                  type="checkbox"
                  value={color.id}
                  {...register("selectedColors")}
                  className="mr-2"
                />
                <span>{color.name}</span>
              </div>
            ))}
          </div>

          {/* Stock Input for Each Size-Color Combination */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock per Variant</label>
            {sizes.map((size) =>
              colors.map((color) => (
                <div key={`${size.id}_${color.id}`} className="flex items-center space-x-2">
                  <label>{`Stock for Size ${size.value} - ${color.name}`}</label>
                  <input
                    type="number"
                    min="0"
                    {...register(`stock_${size.id}_${color.id}`)}
                    className="mt-1 block w-20 border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              ))
            )}
          </div>

          {/* Featured */}
          <div>
            <label className="flex items-center">
              <input type="checkbox" {...register("featured")} className="mr-2" />
              <span className="text-sm font-medium text-gray-700">Featured</span>
            </label>
          </div>

          {/* Release Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Release Year</label>
            <input
              type="number"
              {...register("releaseYear", { required: "Release Year is required" })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            {errors.releaseYear && <p className="text-red-500 text-sm">{errors.releaseYear.message}</p>}
          </div>

          {/* Material */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Material</label>
            <input
              type="text"
              {...register("material", { required: "Material is required" })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            {errors.material && <p className="text-red-500 text-sm">{errors.material.message}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              {...register("gender", { required: "Gender is required" })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
          </div>

          {/* Style Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Style Tags (comma-separated)</label>
            <input
              type="text"
              {...register("styleTags")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="e.g., casual, sporty, elegant"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <input
              type="file"
              multiple
              {...register("images", { required: "At least one image is required" })}
              className="mt-1 block w-full"
            />
            {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md shadow-md transition duration-200"
            >
              {submitting ? "Adding Product..." : "Add Shoe Product"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProductAdd;