import { Route, Routes } from "react-router-dom";
// import Featured from "./components/frontend/Featured";
// import Footer from "./components/frontend/Footer";
// import Hero from "./components/frontend/Hero";
// import Navbar from "./components/frontend/Navbar";
import Home from "./pages/Home";
import Add from "./dashboard/category/Add";
// import Edit from "./dashboard/category/Edit";
import ProductAdd from "./dashboard/product/ProductAdd";
import CategoryIndex from "./dashboard/category/CategoryIndex";
import { Toaster } from "react-hot-toast";
import EditCategory from "./dashboard/category/EditCategory";
import ProductIndex from "./dashboard/product/ProductIndex";
import ProductEdit from "./dashboard/product/ProductEdit";
import ProductsPage from "./pages/ProductsPage";
import ProductPage from "./pages/ProductPage";
import Login from "./pages/Login";
import CheckoutPage from "./pages/CheckoutPage";
import Overview from "./pages/Overview";
import OrderDetails from "./pages/OrderDetails";
import RegisterPage from "./pages/auth/RegisterPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import Loader from "./components/Loader";
import Cart from "./pages/Cart";
import OrderSummary from "./pages/OrderSummary";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import OrderTable from "./dashboard/orders/OrderTable";
import PaymentIndex from "./dashboard/payment/PaymentIndex";
import CityManagementPage from "./dashboard/city/CityManagement";

export default function App() {
  const { user,isAuthenticated,isLoading }  = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(checkAuth())
  },[dispatch])
  if(isLoading) return <Loader />
  return (
    <>
     <Toaster position="top-center" />
      {/* <div className="bg-red-600 p-8">

    </div>
      <div className="w-[90%] mx-auto">
        <Navbar />
      </div>
      <Hero />
      <Featured  />
      <Footer /> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="products" >
        <Route index element={<ProductsPage />} />
          <Route path=":slug" element={<ProductPage />} />
        </Route>
        {/* <Route path="products"> */}
          {/* <Route path=":slug" element={<div>Product Detail</div>} /> */}
        {/* </Route> */}

        <Route path="category">
          <Route index element={<CategoryIndex />} />
          <Route path="add" element={<Add />} />
          
          <Route path=":slug" element={<EditCategory />} />
        </Route>

        <Route path="product">
          <Route index element={<ProductIndex />} />
          <Route path="add" element={<ProductAdd />} />

          <Route path=":slug" element={<ProductEdit />} />

        </Route>
        <Route path="admin/order" element={<OrderTable />} />
        <Route path="admin/payment" element={<PaymentIndex />} />

        <Route path="admin" element={<ProductIndex />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
         <Route path="/payment-failure" element={<PaymentFailure />} />
        <Route path="/city" element={<CityManagementPage />} />
      </Routes>
    </>
  );
}