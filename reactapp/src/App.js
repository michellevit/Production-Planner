import React from "react";
import { Route, Routes } from "react-router-dom"
import Navbar from "./Navbar";
import OpenOrders from "./pages/openOrdersPage/OpenOrders";
import AllOrders from "./pages/allOrdersPage/AllOrders";
import "./styles.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<OpenOrders />} />
          <Route path="/open-orders" element={<OpenOrders />} />
          <Route path="/all-orders" element={<AllOrders />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
