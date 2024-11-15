import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../axios"; // Adjust the path based on your file structure
import DataTable from "react-data-table-component";
// import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal"; // Adjust the path as needed
import Loader from "../Loader";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
// import Loader from "../../components/Loader"; // Import the Loader component

const fetchCategories = async () => {
  const response = await api.get("/api/category");
  return response.data; // Assuming the API returns the array directly
};

const CategoryTable = () => {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = (id) => {
    setSelectedCategoryId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/category/${selectedCategoryId}`);
     
      toast.success("Category deleted successfully!", {
        duration: 3000, // Duration in milliseconds
        position: 'top-center', // Position of the toast
      });
   
       // Should trigger toast
      queryClient.invalidateQueries(["categories"]);
    } catch (error) {
      toast.error(`Error deleting category: ${error.message}`);
    } finally {
      setIsModalOpen(false);
      setSelectedCategoryId(null);
    }
  };

  if (isLoading) {
    return <Loader />; // Show loader while data is being fetched
  }

  if (error) {
    toast.error(`Error fetching categories: ${error.message}`);
    return <p>Error fetching categories</p>;
  }

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: false,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <Link to={`/admin/categories/${row.slug}`} className="text-blue-600 hover:underline">
            Edit
          </Link>
          <button
            onClick={() => handleDeleteClick(row.slug)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="max-w-6xl mx-auto mt-12">
      <h2 className="text-2xl font-semibold mb-6">Categories</h2>

      {/* Add Category Link */}
      <div className="mb-4">
        <Link
          to="/admin/categories/add"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md"
        >
          Add Category
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        pointerOnHover
        responsive
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
        message="Are you sure you want to delete this category?"
      />
    </div>
  );
};
export default CategoryTable;
