import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./OpenOrders.css";
import OrderCard from "./OrderCard";

const Order = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/open-orders/')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error getting data', error);
      });
  }, []);

  return (
    <div className="order-cards-area">
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default Order;