import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderNav from "../../components/OrderNav";
import OrderCard from "./OrderCard";
import ErrorModal from "../../components/ErrorModal";
import "./OpenOrders.css";

const OpenOrders = () => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("false");
  const [orders, setOrders] = useState([]);
  const [refreshOrders, setRefreshOrders] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState("");
  const [minimizeMaximizeAction, setMinimizeMaximizeAction] = useState(0);
  // Sort Filters: Select + Search
  const [currentView, setCurrentView] = useState(
    JSON.parse(localStorage.getItem("openOrders_currentView")) || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  // Sort Filters: Checkboxes
  const [confirmedChecked, setConfirmedChecked] = useState(
    JSON.parse(localStorage.getItem("openOrders_confirmedChecked")) || false
  );
  const [notConfirmedChecked, setNotConfirmedChecked] = useState(
    JSON.parse(localStorage.getItem("openOrders_notConfirmedChecked")) || false
  );
  const [readyChecked, setReadyChecked] = useState(
    JSON.parse(localStorage.getItem("openOrders_readyChecked")) || false
  );
  const [notReadyChecked, setNotReadyChecked] = useState(
    JSON.parse(localStorage.getItem("openOrders_notReadyChecked")) || false
  );
  const [shippedChecked, setShippedChecked] = useState(
    JSON.parse(localStorage.getItem("openOrders_shippedChecked")) || false
  );
  const [notShippedChecked, setNotShippedChecked] = useState(
    JSON.parse(localStorage.getItem("openOrders_notShippedChecked")) || false
  );
  const [delayedChecked, setDelayedChecked] = useState(
    JSON.parse(localStorage.getItem("openOrders_delayedChecked")) || false
  );
  const [notDelayedChecked, setNotDelayedChecked] = useState(
    JSON.parse(localStorage.getItem("openOrders_notDelayedChecked")) || false
  );
  const [quoteChecked, setQuoteChecked] = useState(
    JSON.parse(localStorage.getItem("openOrders_quoteChecked")) || false
  );
  const [notQuoteChecked, setNotQuoteChecked] = useState(
    JSON.parse(localStorage.getItem("openOrders_notQuoteChecked")) || false
  );
  const [oldestChecked, setOldestChecked] = useState(
    JSON.parse(localStorage.getItem("openOrders_oldestChecked")) || false
  );
  const page = "openOrdersPage";

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.REACT_APP_BACKEND_URL}/last-update-stream/`
    );
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.message === "New update") {
        fetchOrders(); 
      }
    };
    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    countNumberOfFilters();
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
    notQuoteChecked,
    oldestChecked,
  ]);

  useEffect(() => {
    localStorage.setItem("openOrders_currentView", JSON.stringify(currentView));
    localStorage.setItem(
      "openOrders_confirmedChecked",
      JSON.stringify(confirmedChecked)
    );
    localStorage.setItem(
      "openOrders_notConfirmedChecked",
      JSON.stringify(notConfirmedChecked)
    );
    localStorage.setItem(
      "openOrders_readyChecked",
      JSON.stringify(readyChecked)
    );
    localStorage.setItem(
      "openOrders_notReadyChecked",
      JSON.stringify(notReadyChecked)
    );
    localStorage.setItem(
      "openOrders_shippedChecked",
      JSON.stringify(shippedChecked)
    );
    localStorage.setItem(
      "openOrders_notShippedChecked",
      JSON.stringify(notShippedChecked)
    );
    localStorage.setItem(
      "openOrders_delayedChecked",
      JSON.stringify(delayedChecked)
    );
    localStorage.setItem(
      "openOrders_notDelayedChecked",
      JSON.stringify(notDelayedChecked)
    );
    localStorage.setItem(
      "openOrders_quoteChecked",
      JSON.stringify(quoteChecked)
    );
    localStorage.setItem(
      "openOrders_notQuoteChecked",
      JSON.stringify(notQuoteChecked)
    );
    localStorage.setItem(
      "openOrders_oldestChecked",
      JSON.stringify(oldestChecked)
    );
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
    notQuoteChecked,
    oldestChecked,
    refreshOrders,
  ]);

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
        `not_quote_checked=${notQuoteChecked}`,
        `oldest_checked=${oldestChecked}`,
      ]
        .filter((param) => param.endsWith("_checked=true"))
        .join("&");
      const requestUrl = `${process.env.REACT_APP_BACKEND_URL}/orders-filtered/?type=open&filter=${currentView}&search=${searchQuery}&${filterParams}`;
      const response = await axios.get(requestUrl);
      let fetchedOrders;
      if (response.data.results) {
        fetchedOrders = response.data.results;
      } else {
        // Direct array of orders for non-paginated response
        fetchedOrders = response.data;
      }
      const processedOrders = fetchedOrders.map((order) => {
        const minimizedStatus = localStorage.getItem(
          `order_minimized_${order.id}`
        );
        return {
          ...order,
          minimized_status: minimizedStatus
            ? JSON.parse(minimizedStatus)
            : true,
        };
      });
      setOrders(fetchedOrders);
      setRefreshOrders(false);
    } catch (error) {
      console.error("Error getting data", error);
    }
  };

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
      notQuoteChecked,
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

  const handleMaximizeAll = () => {
    const updatedOrders = orders.map((order) => {
      localStorage.setItem(
        `order_minimized_${order.id}`,
        JSON.stringify(false)
      );
      return { ...order, minimized_status: false };
    });
    setOrders(updatedOrders);
    setRefreshOrders(true);
    setMinimizeMaximizeAction((prev) => prev + 1);
  };

  const handleMinimizeAll = () => {
    const updatedOrders = orders.map((order) => {
      localStorage.setItem(`order_minimized_${order.id}`, JSON.stringify(true));
      return { ...order, minimized_status: true };
    });
    setOrders(updatedOrders);
    setRefreshOrders(true);
    setMinimizeMaximizeAction((prev) => prev + 1);
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
        notQuoteChecked={notQuoteChecked}
        setNotQuoteChecked={setNotQuoteChecked}
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
              minimizeMaximizeAction={minimizeMaximizeAction}
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
