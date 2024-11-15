import React from "react";
import { Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import ProductsPage from "../pages/ProductsPage";
import ProductPage from "../pages/ProductPage";
import CheckoutPage from "../pages/CheckoutPage";
import Overview from "../pages/Overview";
import OrderDetails from "../pages/OrderDetails";

const UserRoutes = () => (
  <Route element={<UserLayout />}>
  
    <Route path="products">
      <Route index element={<ProductsPage />} />
      <Route path=":slug" element={<ProductPage />} />
    </Route>
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/overview" element={<Overview />} />
    <Route path="/order/:id" element={<OrderDetails />} />
  </Route>
);

export default UserRoutes;
