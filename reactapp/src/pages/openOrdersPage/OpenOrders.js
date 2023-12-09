import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderNav from "../../components/OrderNav";
import OrderCard from "./OrderCard";
import ErrorModal from "./ErrorModal";
import "./OpenOrders.css";

const OpenOrders = () => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("false");
  const [orders, setOrders] = useState([]);
  const [numberOfFilters, setNumberOfFilters] = useState("");
  // Sort Filters: Select + Search
  const [currentView, setCurrentView] = useState(
    JSON.parse(localStorage.getItem("currentView")) || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  // Sort Filters: Checkboxes
  const [confirmedChecked, setConfirmedChecked] = useState(
    JSON.parse(localStorage.getItem("confirmedChecked")) || false
  );
  const [notConfirmedChecked, setNotConfirmedChecked] = useState(
    JSON.parse(localStorage.getItem("notConfirmedChecked")) || false
  );
  const [readyChecked, setReadyChecked] = useState(
    JSON.parse(localStorage.getItem("readyChecked")) || false
  );
  const [notReadyChecked, setNotReadyChecked] = useState(
    JSON.parse(localStorage.getItem("notReadyChecked")) || false
  );
  const [shippedChecked, setShippedChecked] = useState(
    JSON.parse(localStorage.getItem("shippedChecked")) || false
  );
  const [notShippedChecked, setNotShippedChecked] = useState(
    JSON.parse(localStorage.getItem("notShippedChecked")) || false
  );
  const [delayedChecked, setDelayedChecked] = useState(
    JSON.parse(localStorage.getItem("delayedChecked")) || false
  );
  const [notDelayedChecked, setNotDelayedChecked] = useState(
    JSON.parse(localStorage.getItem("notDelayedChecked")) || false
  );
  const [quoteChecked, setQuoteChecked] = useState(
    JSON.parse(localStorage.getItem("quoteChecked")) || false
  );
  const [oldestChecked, setOldestChecked] = useState(
    JSON.parse(localStorage.getItem("oldestChecked")) || false
  );
  const page = "openOrdersPage";

  useEffect(() => {
    countNumberOfFilters();
    const fetchOrders = async () => {
      try {
        const filterParams = [
          `confirmed_checked=${confirmedChecked}`,
          `not_confirmed_checked=${notConfirmedChecked}`,
          `ready_checked=${readyChecked}`,
          `not_ready_checked=${notReadyChecked}`,
          `shipped_checked=${shippedChecked}`,
          `not_shipped_checked=${notShippedChecked}`,
          `delayed_checked=${delayedChecked}`,
          `not_delayed_checked=${notDelayedChecked}`,
          `quote_checked=${quoteChecked}`,
          `oldest_checked=${oldestChecked}`,
        ]
          .filter((param) => param.endsWith("_checked=true"))
          .join("&");
        const requestUrl = `http://127.0.0.1:8000/orders-filtered/?type=open&filter=${currentView}&search=${searchQuery}&${filterParams}`;
        const response = await axios.get(requestUrl);
        setOrders(response.data.results);
      } catch (error) {
        console.error("Error getting data", error);
      }
    };
    fetchOrders();    
  }, [
    currentView,
    searchQuery,
    confirmedChecked,
    notConfirmedChecked,
    readyChecked,
    notReadyChecked,
    shippedChecked,
    notShippedChecked,
    delayedChecked,
    notDelayedChecked,
    quoteChecked,
    oldestChecked,
  ]);

  useEffect(() => {
    localStorage.setItem("currentView", JSON.stringify(currentView));
    localStorage.setItem("confirmedChecked", JSON.stringify(confirmedChecked));
    localStorage.setItem(
      "notConfirmedChecked",
      JSON.stringify(notConfirmedChecked)
    );
    localStorage.setItem("readyChecked", JSON.stringify(readyChecked));
    localStorage.setItem("notReadyChecked", JSON.stringify(notReadyChecked));
    localStorage.setItem("shippedChecked", JSON.stringify(shippedChecked));
    localStorage.setItem(
      "notShippedChecked",
      JSON.stringify(notShippedChecked)
    );
    localStorage.setItem("delayedChecked", JSON.stringify(delayedChecked));
    localStorage.setItem("notDelayedChecked", JSON.stringify(notDelayedChecked));
    localStorage.setItem("quoteChecked", JSON.stringify(quoteChecked));
    localStorage.setItem("oldestChecked", JSON.stringify(oldestChecked));
  }, [
    currentView,
    confirmedChecked,
    notConfirmedChecked,
    readyChecked,
    notReadyChecked,
    shippedChecked,
    notShippedChecked,
    delayedChecked,
    notDelayedChecked,
    quoteChecked,
    oldestChecked,
  ]);

  const countNumberOfFilters = () => {
    const filterStates = [
      confirmedChecked,
      notConfirmedChecked,
      readyChecked,
      notReadyChecked,
      shippedChecked,
      notShippedChecked,
      delayedChecked,
      notDelayedChecked,
      quoteChecked,
    ];
    const numberOfActiveFilters = filterStates.filter(
      (state) => state === true
    ).length;
    setNumberOfFilters(
      numberOfActiveFilters > 0 ? `(${numberOfActiveFilters})` : ""
    );
  };

  const handleSortChange = (filterChoice) => {
    setCurrentView(filterChoice);
    localStorage.setItem("currentView", JSON.stringify(filterChoice));
  };

  const handleSearchOrders = (query) => {
    setSearchQuery(query);
  };

  const handleMaximizeAll = async () => {
    try {
      const updatedOrders = orders.map((order) => ({
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
      setOrders(updatedOrdersData);
    } catch (error) {
      console.error("Error updating orders:", error);
    }
  };

  const handleMinimizeAll = async () => {
    try {
      const updatedOrders = orders.map((order) => ({
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
      setOrders(updatedOrdersData);
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
      <OrderNav
        handleSortChange={handleSortChange}
        handleSearchOrders={handleSearchOrders}
        currentView={currentView}
        numberOfFilters={numberOfFilters}
        confirmedChecked={confirmedChecked}
        setConfirmedChecked={setConfirmedChecked}
        notConfirmedChecked={notConfirmedChecked}
        setNotConfirmedChecked={setNotConfirmedChecked}
        readyChecked={readyChecked}
        setReadyChecked={setReadyChecked}
        notReadyChecked={notReadyChecked}
        shippedChecked={shippedChecked}
        setShippedChecked={setShippedChecked}
        notShippedChecked={notShippedChecked}
        setNotShippedChecked={setNotShippedChecked}
        setNotReadyChecked={setNotReadyChecked}
        delayedChecked={delayedChecked}
        setDelayedChecked={setDelayedChecked}
        notDelayedChecked={notDelayedChecked}
        setNotDelayedChecked={setNotDelayedChecked}
        quoteChecked={quoteChecked}
        setQuoteChecked={setQuoteChecked}
        oldestChecked={oldestChecked}
        setOldestChecked={setOldestChecked}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleMaximizeAll={handleMaximizeAll}
        handleMinimizeAll={handleMinimizeAll}
        page={page}
      />
      {orders ? (
        orders.length === 0 ? (
          <div className="no-results">No results...</div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              orders={orders}
              setOrders={setOrders}
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
