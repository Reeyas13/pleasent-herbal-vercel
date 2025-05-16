// ProductTable.js
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../axios"; // Adjust the path based on your file structure
import DataTable from "react-data-table-component";
import ConfirmModal from "./ConfirmModal"; // Adjust the path as needed
import Loader from "../Loader"; // Ensure you have a Loader component
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const fetchProducts = async () => {
  const response = await api.get("/api/products");
  console.log(response.data);
  return response.data; // Assuming the API returns the array directly
};

const ProductTable = () => {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = (id) => {
    setSelectedProductId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/products/${selectedProductId}`);
      toast.success("Product deleted successfully!", {
        duration: 3000,
        position: "top-center",
      });
      queryClient.invalidateQueries(["products"]);
    } catch (error) {
      toast.error(`Error deleting product: ${error.message}`);
    } finally {
      setIsModalOpen(false);
      setSelectedProductId(null);
    }
  };

  if (isLoading) {
    return <Loader />; // Show loader while data is being fetched
  }

  if (error) {
    toast.error(`Error fetching products: ${error.message}`);
    return <p>Error fetching products</p>;
  }

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
      format: (row) => `$${row.price.toFixed(2)}`, // Format price as currency
    },{
        name:"Category",
        selector: (row) => row?.categories?.name,
        sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <Link to={`/admin/products/${row.slug}`} className="text-blue-600 hover:underline">
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
      <h2 className="text-2xl font-semibold mb-6">Products</h2>

      {/* Add Product Link */}
      <div className="mb-4">
        <Link
          to="/admin/products/add"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md"
        >
          Add Product
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
        message="Are you sure you want to delete this product?"
      />
    </div>
  );
};

export default ProductTable;
