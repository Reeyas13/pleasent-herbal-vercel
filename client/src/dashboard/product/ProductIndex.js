import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProductsTable from "../../components/backend/ProductsTable";

const ProductIndex = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Products</h2>
        <ProductsTable />
      </div>
    </DashboardLayout>
  );
};

export default ProductIndex;
