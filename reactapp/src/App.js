import React from "react";
import "./App.css";

//Importing Components
import Order from "./components/pages/openOrdersPage/Order";
import NotesListSection from "./components/pages/openOrdersPage/NotesListSection";

function App() {
  return (
    <div className="App">
      <header>
        <h1>Open Orders</h1>
      </header>
      <h2>Date: </h2>
      <Order />
      <NotesListSection />
    </div>
  );
}

export default App;
