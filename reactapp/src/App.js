import React from "react";
import { useState, useEffect } from "react";
import "./App.css";

//Importing Components
import OpenOrders from "./components/pages/openOrdersPage/OpenOrders";

function App() {
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    const formattedDate = new Date().toLocaleDateString(undefined, options);
    setCurrentDate(formattedDate);
  }, []);
  return (
    <div className="App">
      <header>
        <h1>Open Orders</h1>
      </header>
      <h2>{currentDate}</h2>
      <div className="order-cards-area">
        <OpenOrders />
      </div>
    </div>
  );
}

export default App;
