import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OpenOrders.css";
import OrderCard from "./OrderCard";
import OpenOrdersNav from "./OpenOrdersNav";

const OpenOrders = () => {
  const [openOrders, setOpenOrders] = useState([]);
  const [sortOption, setSortOption] = useState("All"); 
  // const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    fetchOpenOrders();
  }, [sortOption]);

  const fetchOpenOrders = () => {
    let sortingCriteria = "ship_date";
    switch (sortOption) {
      case "Today":
        sortingCriteria = "ship_date"; 
        break;
      case "Tomorrow":
        sortingCriteria = "ship_date"; 
        break;
      case "This Week":
        sortingCriteria = "ship_date"; 
        break;
      case "This Month":
        sortingCriteria = "ship_date"; 
        break;
      default:
        // For "All" and other options, use the default sorting criteria
        sortingCriteria = "ship_date";
    }
    axios
      .get("http://127.0.0.1:8000/open-orders/")
      .then((response) => {
        const filteredOpenOrders = response.data.filter(
          (order) => !order.shipped
        );
        filteredOpenOrders.sort((a, b) =>
          a[sortingCriteria] < b[sortingCriteria] ? 1 : -1
        );
        setOpenOrders(filteredOpenOrders);
      })
      .catch((error) => {
        console.error("Error getting data", error);
      });
  };

  const handleSortChange = (event) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);
  };

  const handleFilterOrders = (query) => {
    if (query === "") {
      fetchOpenOrders();
    } else {
      axios
        .get(`http://127.0.0.1:8000/open-orders-search/?search=${query}`)
        .then((response) => {
          const filteredOpenOrders = response.data;
          filteredOpenOrders.sort((a, b) =>
            a.ship_date < b.ship_date ? 1 : -1
          );
          setOpenOrders(filteredOpenOrders);
        })
        .catch((error) => {
          console.error("Error searching orders:", error);
        });
    }
  };

  const handleMaximizeAll = async () => {
    try {
      const updatedOrders = openOrders.map((order) => ({
        ...order,
        minimized_status: false,
      }));
      const updatePromises = updatedOrders.map(async (updatedOrder) => {
        await axios.put(
          `http://127.0.0.1:8000/open-orders/${updatedOrder.id}/`,
          updatedOrder
        );
        return updatedOrder;
      });
      const updatedOrdersData = await Promise.all(updatePromises);
      setOpenOrders(updatedOrdersData);
    } catch (error) {
      console.error("Error updating orders:", error);
    }
  };
  
  const handleMinimizeAll = async () => {
    try {
      const updatedOrders = openOrders.map((order) => ({
        ...order,
        minimized_status: true,
      }));

      const updatePromises = updatedOrders.map(async (updatedOrder) => {
        await axios.put(
          `http://127.0.0.1:8000/open-orders/${updatedOrder.id}/`,
          updatedOrder
        );
        return updatedOrder;
      });
  
      const updatedOrdersData = await Promise.all(updatePromises);
      setOpenOrders(updatedOrdersData);
    } catch (error) {
      console.error("Error updating orders:", error);
    }
  };

  return (
    <div className="main-div">
      <OpenOrdersNav
        handleFilterOrders={handleFilterOrders}
        handleMaximizeAll={handleMaximizeAll}
        handleMinimizeAll={handleMinimizeAll}
        handleSortChange={handleSortChange}
      />
      {openOrders.length === 0 ? (
        <div>No results...</div>
      ) : (
        openOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            openOrders={openOrders}
            setOpenOrders={setOpenOrders}
          />
        ))
      )}
    </div>
  );
};

export default OpenOrders;
