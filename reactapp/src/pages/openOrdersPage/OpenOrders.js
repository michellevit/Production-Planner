import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./OpenOrders.css";
import OrderCard from "./OrderCard";

const OpenOrders = () => {
  const [openOrders, setOpenOrders] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    const formattedDate = new Date().toLocaleDateString(undefined, options);
    setCurrentDate(formattedDate);
  }, []);
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/open-orders/')
      .then(response => {
        const filteredOpenOrders = response.data.filter(order => !order.shipped);
        filteredOpenOrders.sort((a, b) =>
          a.ship_date < b.ship_date ? 1 : -1
        );
        setOpenOrders(filteredOpenOrders);
      })
      .catch(error => {
        console.error('Error getting data', error);
      });
  }, []);

  return (
    <div className="main-div">
      <header>
        <h1>Open Orders</h1>
      </header>
      <h2>{currentDate}</h2>
      {openOrders.map(order => (
        <OrderCard 
        key={order.id} 
        order={order}
        openOrders={openOrders}
        setOrders={setOpenOrders} />
      ))}
    </div>
  );
};

export default OpenOrders;