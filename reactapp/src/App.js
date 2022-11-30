import React from "react";
import "./App.css";
//Importing Components
import Order from "./components/Order";

function App() {
  return (
    <body>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css"
          integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk="
          crossorigin="anonymous"
        />
      </head>
      <div className="App">
        <header>
          <h1>Open Orders</h1>
        </header>
        <h2>Date</h2>
        <Order />
      </div>
    </body>
  );
}

export default App;
