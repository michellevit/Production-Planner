import React from "react";
import { Route, Routes } from "react-router-dom";
import LatestUpload from "./LatestUpload";
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
          <Route path="/" element={<LatestUpload />} />  
          <Route path="/home" element={<LatestUpload />} />  
          <Route path="/latest-upload" element={<LatestUpload />} />
          <Route path="/add-order" element={<AddOrder />} />
          <Route path="/add-dimensions" element={<AddDimensions />} />
        </Routes>
      </div>
    </div>
  );
}

export default HomePage;
