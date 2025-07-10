import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import WalmartHomepage from "./Components/WalmartHomepage";
import AllProducts from "./Components/AllProducts";
import CartPage from "./Components/CartPage";
import { CartContextProvider } from "./context/CartContext.jsx";
import EcoStore from "./pages/EcoStore.jsx";
import "./App.css";

const App = () => {
  return (
    <CartContextProvider>
      <Routes>
        <Route path="/ecostore" element={<EcoStore />} />
        <Route path="/" element={<WalmartHomepage />} />
        <Route path="/shop" element={<AllProducts />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </CartContextProvider>
  );
};

export default App;
