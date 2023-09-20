import React from "react";
import { useState, useEffect } from "react";
import "./App.css";


//Importing Components
import OpenOrders from "./components/pages/openOrdersPage/OpenOrders";

function App() {
  return (
    <div className="App">
        <OpenOrders />
    </div>
  );
}

export default App;
