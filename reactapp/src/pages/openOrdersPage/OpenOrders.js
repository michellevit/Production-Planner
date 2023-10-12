import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OpenOrders.css";
import OrderCard from "./OrderCard";
import OpenOrdersNav from "./OpenOrdersNav";
import ErrorModal from "./ErrorModal";

const OpenOrders = () => {
  const [openOrders, setOpenOrders] = useState([]);
  const [sortOption, setSortOption] = useState("All");
  const [currentDate, setCurrentDate] = useState("");
  const [readyChecked, setReadyChecked] = useState(true);
  const [notReadyChecked, setNotReadyChecked] = useState(true);
  const [delayedChecked, setDelayedChecked] = useState(true);
  const [oldestChecked, setOldestChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("false");
  useEffect(() => {
    const formattedDate = new Date();
    formattedDate.setHours(0, 0, 0, 1);
    setCurrentDate(formattedDate);
    const fetchOpenOrders = () => {
      axios
        .get("http://127.0.0.1:8000/open-orders/")
        .then((response) => {
          let filteredOpenOrders = response.data;
          if (searchQuery !== "") {
            filteredOpenOrders = handleSearchOrders(searchQuery);
          } else {
            filteredOpenOrders = applySorting(filteredOpenOrders);
          }
          setOpenOrders(filteredOpenOrders);
        })
        .catch((error) => {
          console.error("Error getting data", error);
        });
    };
    fetchOpenOrders();
  }, [
    sortOption,
    readyChecked,
    notReadyChecked,
    delayedChecked,
    oldestChecked,
    searchQuery,
  ]);

  const applySorting = (filteredOpenOrders) => {
    let filterByAll = false;
    let filterByUpcoming = false;
    let filterByPast = false;
    let filterByToday = false;
    let filterByTomorrow = false;
    let filterByThisWeek = false;
    let filterByNextWeek = false;
    let filterByThisMonth = false;
    let filterByLastWeek = false;
    let filterByLastMonth = false;
    switch (sortOption) {
      case "All":
        filterByAll = true;
        break;
      case "Upcoming":
        filterByUpcoming = true;
        break;
      case "Past":
        filterByPast = true;
        break;
      case "Today":
        filterByToday = true;
        break;
      case "Tomorrow":
        filterByTomorrow = true;
        break;
      case "This-Week":
        filterByThisWeek = true;
        break;
      case "Next-Week":
        filterByNextWeek = true;
        break;
      case "This-Month":
        filterByThisMonth = true;
        break;
      case "Last-Week":
        filterByLastWeek = true;
        break;
      case "Last-Month":
        filterByLastMonth = true;
        break;
      default:
        filterByAll = true;
    }
    if (readyChecked && notReadyChecked && delayedChecked) {
      filteredOpenOrders = filteredOpenOrders.filter(
        (order) => order.ready != null
      );
    }
    if (readyChecked && !notReadyChecked && !delayedChecked) {
      filteredOpenOrders = filteredOpenOrders.filter(
        (order) => order.ready === true
      );
    }
    if (readyChecked && notReadyChecked && !delayedChecked) {
      filteredOpenOrders = filteredOpenOrders.filter(
        (order) => order.ready != null && (order.delay_date === null && order.delay_tbd === false)
      );
    }
    if (readyChecked && !notReadyChecked && delayedChecked) {
      filteredOpenOrders = filteredOpenOrders.filter(
        (order) => order.ready === true
      );
    }
    if (!readyChecked && notReadyChecked && delayedChecked) {
      filteredOpenOrders = filteredOpenOrders.filter(
        (order) => order.ready === false
      );
    }
    if (!readyChecked && notReadyChecked && !delayedChecked) {
      filteredOpenOrders = filteredOpenOrders.filter(
        (order) => order.ready === false && (order.delay_date === null && order.delay_tbd === false)
      );
    }
    if (!readyChecked && !notReadyChecked && delayedChecked) {
      filteredOpenOrders = filteredOpenOrders.filter(
        (order) => order.delay_date != null || order.delay_tbd === true
      );
    }
    if (!readyChecked && !notReadyChecked && !delayedChecked) {
      filteredOpenOrders = filteredOpenOrders.filter(
        (order) => order.ready === null
      );
    }
    if (filterByUpcoming) {
      filteredOpenOrders = filteredOpenOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        const orderDateTimestamp = orderDate.getTime();
        const today = new Date(currentDate);
        today.setUTCHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();

        return orderDateTimestamp >= todayTimestamp;
      });
    }
    if (filterByPast) {
      filteredOpenOrders = filteredOpenOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        const orderDateTimestamp = orderDate.getTime();
        const today = new Date(currentDate);
        today.setUTCHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();
        return orderDateTimestamp < todayTimestamp;
      });
    }
    if (filterByToday) {
      const today = new Date(currentDate);
      today.setUTCHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();
      filteredOpenOrders = filteredOpenOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        const orderDateTimestamp = orderDate.getTime();
        return orderDateTimestamp === todayTimestamp;
      });
    }
    if (filterByTomorrow) {
      const tomorrow = new Date(currentDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      const tomorrowTimestamp = tomorrow.getTime();
      filteredOpenOrders = filteredOpenOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        const orderDateTimestamp = orderDate.getTime();
        return orderDateTimestamp === tomorrowTimestamp;
      });
    }
    if (filterByThisWeek) {
      const today = new Date(currentDate);
      const currentDayOfWeek = today.getDay();
      const daysUntilSunday = 7 - currentDayOfWeek;
      let startOfWeek = new Date(today);
      let endOfWeek = new Date(today);
      if (currentDayOfWeek === 0) {
        startOfWeek.setDate(today.getDate());
        endOfWeek.setDate(today.getDate() + 6);
      } else {
        startOfWeek.setDate(today.getDate() - currentDayOfWeek);
        endOfWeek.setDate(today.getDate() + daysUntilSunday - 1);
      }
      startOfWeek.setUTCHours(0, 0, 0, 0);
      endOfWeek.setUTCHours(23, 59, 59, 999);
      filteredOpenOrders = filteredOpenOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        return orderDate >= startOfWeek && orderDate <= endOfWeek;
      });
    }
    if (filterByNextWeek) {
      const today = new Date(currentDate);
      const currentDayOfWeek = today.getDay();
      const daysUntilSunday = 7 - currentDayOfWeek;
      let startOfNextWeek = new Date(today);
      let endOfNextWeek = new Date(today);
      if (currentDayOfWeek === 0) {
        startOfNextWeek.setDate(today.getDate() + 7);
        endOfNextWeek.setDate(today.getDate() + 13);
      } else {
        startOfNextWeek.setDate(today.getDate() + daysUntilSunday);
        endOfNextWeek.setDate(today.getDate() + daysUntilSunday + 6);
      }
      startOfNextWeek.setUTCHours(0, 0, 0, 0);
      endOfNextWeek.setUTCHours(23, 59, 59, 999);
      filteredOpenOrders = filteredOpenOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        return orderDate >= startOfNextWeek && orderDate <= endOfNextWeek;
      });
    }
    if (filterByThisMonth) {
      const startOfMonth = new Date(currentDate);
      startOfMonth.setDate(1);
      startOfMonth.setUTCHours(0, 0, 0, 0);
      const endOfMonth = new Date(currentDate);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setUTCHours(23, 59, 59, 999);
      filteredOpenOrders = filteredOpenOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        return orderDate >= startOfMonth && orderDate <= endOfMonth;
      });
    }
    if (filterByLastWeek) {
      const today = new Date(currentDate);
      const currentWeekStart = new Date(today);
      currentWeekStart.setDate(today.getDate() - today.getDay());
      currentWeekStart.setUTCHours(0, 0, 0, 0);
      const lastWeekEnd = new Date(currentWeekStart);
      lastWeekEnd.setDate(currentWeekStart.getDate() - 1);
      lastWeekEnd.setUTCHours(23, 59, 59, 999);
      const lastWeekStart = new Date(lastWeekEnd);
      lastWeekStart.setDate(lastWeekEnd.getDate() - 6);
      lastWeekStart.setUTCHours(0, 0, 0, 0);
      filteredOpenOrders = filteredOpenOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        return orderDate >= lastWeekStart && orderDate <= lastWeekEnd;
      });
    }
    if (filterByLastMonth) {
      const today = new Date(currentDate);
      const currentMonthStart = new Date(today);
      currentMonthStart.setUTCHours(0, 0, 0, 0);
      currentMonthStart.setDate(1);
      const lastMonthEnd = new Date(currentMonthStart - 1);
      lastMonthEnd.setUTCHours(23, 59, 59, 999);
      lastMonthEnd.setDate(lastMonthEnd.getDate() - 1);
      const lastMonthStart = new Date(lastMonthEnd);
      lastMonthStart.setDate(1);
      lastMonthStart.setUTCHours(0, 0, 0, 0);
      filteredOpenOrders = filteredOpenOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
      });
    }
    if (oldestChecked) {
      filteredOpenOrders.sort((a, b) => (a.ship_date > b.ship_date ? 1 : -1));

    } else {
      filteredOpenOrders.sort((a, b) => (a.ship_date < b.ship_date ? 1 : -1));
    }
    filteredOpenOrders.sort((a, b) => {
      if (a.delay_date === null && a.delay_tbd === true) return 1;
      if (b.delay_date === null && b.delay_tbd === true) return -1;
    });
    return filteredOpenOrders;
  };

  const handleSortChange = (event) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);
  };

  const handleSearchOrders = (query) => {
    if (query === "") {
      setSearchQuery("");
    } else {
      axios
        .get(`http://127.0.0.1:8000/open-orders-search/?search=${query}`)
        .then((response) => {
          let filteredOpenOrders = response.data;
          filteredOpenOrders = applySorting(filteredOpenOrders);
          setOpenOrders(filteredOpenOrders);
          return filteredOpenOrders;
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
    <div className="open-main-div">
      <ErrorModal 
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      <OpenOrdersNav
        handleSearchOrders={handleSearchOrders}
        handleMaximizeAll={handleMaximizeAll}
        handleMinimizeAll={handleMinimizeAll}
        handleSortChange={handleSortChange}
        readyChecked={readyChecked}
        setReadyChecked={setReadyChecked}
        notReadyChecked={notReadyChecked}
        setNotReadyChecked={setNotReadyChecked}
        delayedChecked={delayedChecked}
        setDelayedChecked={setDelayedChecked}
        oldestChecked={oldestChecked}
        setOldestChecked={setOldestChecked}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {openOrders ? (
        openOrders.length === 0 ? (
          <div className="no-results">No results...</div>
        ) : (
          openOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              openOrders={openOrders}
              setOpenOrders={setOpenOrders}
              showErrorModal={showErrorModal}
              setShowErrorModal={setShowErrorModal}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          ))
        )
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default OpenOrders;
