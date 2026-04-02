import React from "react";
import { Route, Routes } from "react-router-dom";
import SellerRegistration from "../Components/Seller/Register";
import SellerLogin from "../Components/Seller/Login";
import SellerProductPage from "../Components/Seller/Product";
import Dashboard from "../Components/Seller/Dashboard";
import SellerProtect from "./Protect/SellerProtect";
import SellerReProtect from "./Protect/ReveseSellerProtect";
import SalesReportPage from "../Components/Seller/SalesReportPage";
import SellerOrders from "../Components/Seller/SellerOrders";



const Seller: React.FC = () => {
    return (
      <>
        <Routes>
        SellerProtect
        
          <Route path="/register" element={<SellerReProtect component={SellerRegistration} />} />
          <Route path="/" element={< SellerReProtect component={SellerLogin}/>} />   
          <Route path="/product" element={<SellerProtect component={SellerProductPage}/>} />   
          <Route path="/dashboard" element={<SellerProtect component={Dashboard}/>} />   
          <Route path="/sales-report" element={<SellerProtect component={SalesReportPage}/>} />   
          <Route path="/orders" element={<SellerProtect component={SellerOrders}/>} />   
          </Routes>
      </>
    );
  };
  
  export default Seller;
  