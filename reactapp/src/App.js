import React from "react";
import { useState, useEffect } from "react";
import "./App.css";

//Importing Components
import Order from "./components/pages/openOrdersPage/Order";

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
      <Order />
    </div>
  );
}

export default App;
