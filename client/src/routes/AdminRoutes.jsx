import React, { lazy } from "react";
import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayouts";

const CategoryIndex = lazy(() => import("../dashboard/category/CategoryIndex"));
const AddCategory = lazy(() => import("../dashboard/category/Add"));
const EditCategory = lazy(() => import("../dashboard/category/EditCategory"));
const ProductIndex = lazy(() => import("../dashboard/product/ProductIndex"));
const ProductAdd = lazy(() => import("../dashboard/product/ProductAdd"));
const ProductEdit = lazy(() => import("../dashboard/product/ProductEdit"));

const AdminRoutes = () => (
  <Route element={<AdminLayout />}>
    <Route path="category">
      <Route index element={<CategoryIndex />} />
      <Route path="add" element={<AddCategory />} />
      <Route path=":slug" element={<EditCategory />} />
    </Route>
    <Route path="product">
      <Route index element={<ProductIndex />} />
      <Route path="add" element={<ProductAdd />} />
      <Route path=":slug" element={<ProductEdit />} />
    </Route>
  </Route>
);

export default AdminRoutes;
