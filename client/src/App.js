import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, Suspense, lazy } from "react";
import { checkAuth } from "./store/auth-slice";
import Loader from "./components/Loader";

// Frontend Pages
import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import CheckoutPage from "./pages/CheckoutPage";
import Overview from "./pages/Overview";
import Login from "./pages/Login";
import RegisterPage from "./pages/auth/RegisterPage";
import OrderDetails from "./pages/OrderDetails";
import OrderSummary from "./pages/OrderSummary";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import Unauthenticated from "./pages/Unauthenticated";
import NotFoundPage from "./pages/NotFound";
import UserLayout from "./layouts/UserLayout";
import VerifyLogin from "./pages/VerifyLogin";
import Profile from "./pages/Profile";
import AddShoeColor from "./dashboard/attributes/AddShoeColor";
import AddShoeSize from "./dashboard/attributes/AddShoeSize";
import AddShoeBrand from "./dashboard/attributes/AddShoeBrand";

// Lazy-loaded Admin Dashboard Components
const AdminLayout = lazy(() => import("./layouts/AdminLayouts"));
const CategoryIndex = lazy(() => import("./dashboard/category/CategoryIndex"));
const AddCategory = lazy(() => import("./dashboard/category/Add"));
const EditCategory = lazy(() => import("./dashboard/category/EditCategory"));
const ProductIndex = lazy(() => import("./dashboard/product/ProductIndex"));
const AddProduct = lazy(() => import("./dashboard/product/ProductAdd"));
const EditProduct = lazy(() => import("./dashboard/product/ProductEdit"));
const OrderTable = lazy(() => import("./dashboard/orders/OrderTable"));
const PaymentIndex = lazy(() => import("./dashboard/payment/PaymentIndex"));
const CityManagementPage = lazy(() => import("./dashboard/city/CityManagement"));

export default function App() {
  // const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(checkAuth());
  // }, [dispatch]);

  // if (isLoading) return <Loader />;

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        {/* Frontend Routes */}
        <Route path="/" element={<Home  />} />
        {/* <Route element={<UserLayout />}> */}
          <Route path="products">
            <Route index element={<ProductsPage />} />
            <Route path=":slug" element={<ProductPage />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-summary" element={<OrderSummary />} />

          <Route path="" element={<UserLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/order/:id" element={<OrderDetails />} />
        </Route>
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
        {/* </Route> */}

        {/* Authentication Routes */}
        /**
         *do's- - -- - - -- logout bananu baki ra 
         *    --------------login vaisako user login ma jada redirect to home 
         *------aaru ta styling matra garnu xa
         */
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-login" element={<VerifyLogin />} />
 
        {/* Dashboard Routes (Lazy-loaded) */}
        <Route
          path="admin"
          element={
            <Suspense fallback={<Loader />}>
              <AdminLayout />
            </Suspense>
          }
        >
          {/* Category Management */}
          <Route
            path="categories"
            element={
              <Suspense fallback={<Loader />}>
                <CategoryIndex />
              </Suspense>
            }
          />
          <Route
            path="categories/add"
            element={
              <Suspense fallback={<Loader />}>
                <AddCategory />
              </Suspense>
            }
          />
          <Route
            path="categories/:slug"
            element={
              <Suspense fallback={<Loader />}>
                <EditCategory />
              </Suspense>
            }
          />

          {/* Product Management */}
          <Route
            path="products"
            element={
              <Suspense fallback={<Loader />}>
                <ProductIndex />
              </Suspense>
            }
          />
          <Route
            path="products/add"
            element={
              <Suspense fallback={<Loader />}>
                <AddProduct />
              </Suspense>
            }
          />
          <Route
            path="products/:slug"
            element={
              <Suspense fallback={<Loader />}>
                <EditProduct />
              </Suspense>
            }
          />
          <Route 
          path="shoe-colors/add"
          element = {
            <Suspense fallback={<Loader />}>
              <AddShoeColor />
            </Suspense>
          }
          />
          <Route 
          path="shoe-size/add"
          element = {
            <Suspense fallback={<Loader />}>
              <AddShoeSize />
            </Suspense>
          }
          />
          <Route 
          path="shoe-brand/add"
          element = {
            <Suspense fallback={<Loader />}>
              <AddShoeBrand />
            </Suspense>
          }
          />

          {/* Orders and Payments Management */}
          <Route
            path="orders"
            element={
              <Suspense fallback={<Loader />}>
                <OrderTable />
              </Suspense>
            }
          />
          <Route
            path="payments"
            element={
              <Suspense fallback={<Loader />}>
                <PaymentIndex />
              </Suspense>
            }
          />

          {/* City Management */}
          <Route
            path="cities"
            element={
              <Suspense fallback={<Loader />}>
                <CityManagementPage />
              </Suspense>
            }
          />
        </Route>

        {/* Unauthenticated and 404 Pages */}
        <Route path="/unauthorized" element={<Unauthenticated />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
