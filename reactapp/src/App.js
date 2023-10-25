import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Changed import

import Navbar from "./Navbar";
import HomePage from "./pages/homePage/HomePage";
import OpenOrders from "./pages/openOrdersPage/OpenOrders";
import AllOrders from "./pages/allOrdersPage/AllOrders";
import AddOrder from "./pages/homePage/AddOrder";
import AddOrderReport from "./pages/homePage/AddReport";
import AddDimensions from "./pages/homePage/AddDimensions";
import "./styles.css";

function App() {
  return (
    <div className="app">
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="home" element={<HomePage />} />
            <Route path="add-order" element={<AddOrder />} />
            <Route path="add-order-report" element={<AddOrderReport />} />
            <Route path="add-dimensions" element={<AddDimensions />} />
            <Route path="open-orders" element={<OpenOrders />} />
            <Route path="all-orders" element={<AllOrders />} />
            <Route path="/*" element={<HomePage />} /> 
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
