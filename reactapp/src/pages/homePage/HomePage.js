import React from "react";
import { Route, Routes } from "react-router-dom";
import LastUpdate from "./LastUpdate";
import AddOrder from "./AddOrder";
import AddDimensions from "./AddDimensions";
import "./HomePage.css";
import HomePageNav from "./HomePageNav";

function HomePage() {
  return (
    <div className="home-page">
      <HomePageNav />
      <div className="container">
        <Routes>
          <Route path="/" element={<LastUpdate />} />  
          <Route path="/home" element={<LastUpdate />} />  
          <Route path="/last-update" element={<LastUpdate />} />
          <Route path="/add-order" element={<AddOrder />} />
          <Route path="/add-dimensions" element={<AddDimensions />} />
        </Routes>
      </div>
    </div>
  );
}

export default HomePage;
