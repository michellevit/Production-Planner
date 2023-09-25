import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OpenOrders.css";
import OrderCard from "./OrderCard";
import OpenOrdersNav from "./OpenOrdersNav";

const OpenOrders = () => {
  const [openOrders, setOpenOrders] = useState([]); 
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    const formattedDate = new Date().toLocaleDateString(undefined, options);
    setCurrentDate(formattedDate);
    fetchOpenOrders();
  }, []);

  const fetchOpenOrders = () => {
    axios
      .get("http://127.0.0.1:8000/open-orders/")
      .then((response) => {
        const filteredOpenOrders = response.data.filter(
          (order) => !order.shipped
        );
        filteredOpenOrders.sort((a, b) => (a.ship_date < b.ship_date ? 1 : -1));
        setOpenOrders(filteredOpenOrders)
      })
      .catch((error) => {
        console.error("Error getting data", error);
      });
  };

  const handleFilterOrders = (query) => {
    if (query === "") {
      fetchOpenOrders();
    } else {
      axios
        .get(`http://127.0.0.1:8000/open-orders-search/?search=${query}`)
        .then((response) => {
          const filteredOpenOrders = response.data;
          filteredOpenOrders.sort((a, b) => (a.ship_date < b.ship_date ? 1 : -1));
          setOpenOrders(filteredOpenOrders);
        })
        .catch((error) => {
          console.error("Error searching orders:", error);
        });
    }
  };
  return (
    <div className="main-div">
      <OpenOrdersNav
        handleFilterOrders={handleFilterOrders} 
      />
      {openOrders.length === 0 ? (
        <div>No results...</div>
      ) : (
        openOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
          />
        ))
      )}
    </div>
  );
};

export default OpenOrders;
