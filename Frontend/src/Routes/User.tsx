import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "../Components/User/HomePage";
import Shop from "../Components/User/Shop";
import ProductPage from "../Components/User/ProductDetail";
import CategoryPages from "../Components/User/Category";
import FilterProduct from "../Components/User/FilterProduct";
import Subcategory from "../Components/User/SubCategory";
import Types from "../Components/User/Types";
import AboutPage from "../Components/Layouts/About";
import SellerPages from "../Components/User/Sellers";
import ContactPage from "../Components/Layouts/Contact";
import CartPage from "../Components/User/Cart";
import OrdersPage from "../Components/User/OrdersPage";
import OrderSuccess from "../Components/User/OrderSuccess";
import CheckoutPage from "../Components/User/ChekoutPage";
import OrderDetails from "../Components/User/OrderDetails";
import ProfilePage from "../Components/User/ProfilePage";

const User: React.FC = () => {
    return (
      <>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/Shop" element={<Shop/>} />
          <Route path="/product" element={<ProductPage/>} />
          <Route path="/product/:id" element={<ProductPage/>}/>
          <Route path="/category" element={<CategoryPages/>}/>
          <Route path="/seller-list/:seller/category/:category" element={<Subcategory/>}/>
          <Route path="/product-type/:category" element={<Types/>}/>
          <Route path="/products/:seller/:category/:id" element={<FilterProduct/>}/>
          <Route path="/about" element={<AboutPage/>}/>
          <Route path="/seller-list" element={<SellerPages/>}/>
          <Route path="/seller-list/:id" element={<CategoryPages/>}/>
          <Route path="/contact" element={<ContactPage/>}/>
          <Route path="/cart" element={<CartPage/>}/>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          {/* <Route path="/orders" element={<OrdersPage />} /> */}
          {/* <Route path="/order/:orderId" element={<OrderDetails />} /> */}
          <Route path="/profile" element={<ProfilePage />} />
       </Routes>
      </>
    );
  };
  
  export default User;
  