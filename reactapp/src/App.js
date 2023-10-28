import React from "react";
import { Route, Routes } from 'react-router-dom';

import Navbar from "./Navbar";
import HomePage from "./pages/homePage/HomePage";
import OpenOrders from "./pages/openOrdersPage/OpenOrders";
import AllOrders from "./pages/allOrdersPage/AllOrders";
import "./styles.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="home/*" element={<HomePage />} />
          <Route path="open-orders" element={<OpenOrders />} />
          <Route path="all-orders" element={<AllOrders />} />
          <Route path="/*" element={<HomePage />} /> 
        </Routes>
      </div>
    </div>
  );
}

export default App;