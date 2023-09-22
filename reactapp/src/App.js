import React from "react";
import { Route, Routes } from "react-router-dom"
import Navbar from "./Navbar";
import OpenOrders from "./pages/openOrdersPage/OpenOrders";
import ClosedOrders from "./pages/closedOrdersPage/ClosedOrders";
import "./styles.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<OpenOrders />} />
          <Route path="/open-orders" element={<OpenOrders />} />
          <Route path="/closed-orders" element={<ClosedOrders />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
