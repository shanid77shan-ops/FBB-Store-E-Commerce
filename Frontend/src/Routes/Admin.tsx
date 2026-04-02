import React from "react";
import { Route, Routes } from "react-router-dom";
import CategoryManager from "../Components/Admin/Category";
import ProductPage from "../Components/Admin/Product";
import SubCategory from "../Components/Admin/Subcategory";
import ProductType from "../Components/Admin/ProductType";
import AdminLogin from "../Components/Admin/Login";
import Protect from "./Protect/Protected";
import ReProtect from "./Protect/ReverseProtect";
import SellerPage from "../Components/Admin/Sellers";
import SellerProducts from "../Components/Admin/SellerProduct";
import AdminDashboard from "../Components/Admin/AdminDashboard";
import AdminLayout from "../Components/Layouts/AdminLayout";
import OrdersPage from "../Components/Admin/Orders";


const Admin: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<ReProtect component={AdminLogin} />} />
      
      {/* All protected admin routes wrapped with AdminLayout */}
      <Route element={<AdminLayout />}>
        <Route index element={<Protect component={AdminDashboard} />} />
        <Route path="dashboard" element={<Protect component={AdminDashboard} />} />
        <Route path="category" element={<Protect component={CategoryManager} />} />
        <Route path="sub-category" element={<Protect component={SubCategory} />} />
        <Route path="product-type" element={<Protect component={ProductType} />} />
        <Route path="product" element={<Protect component={ProductPage} />} />
        <Route path="sellers" element={<Protect component={SellerPage} />} />
        <Route path="sellers/:id" element={<Protect component={SellerProducts} />} />
        <Route path="/orders" element={<Protect component={OrdersPage} />} />
      </Route>
    </Routes>
  );
};

export default Admin;