import React, { useState } from "react";
import "./OrderNav.css";
import OrderNavFilter from "./OrderNavFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpRightAndDownLeftFromCenter,
  faDownLeftAndUpRightToCenter,
} from "@fortawesome/free-solid-svg-icons";

const OrderNav = ({
  handleSortChange,
  handleSearchOrders,
  currentView,
  numberOfFilters,
  confirmedChecked,
  setConfirmedChecked,
  notConfirmedChecked,
  setNotConfirmedChecked,
  readyChecked,
  setReadyChecked,
  notReadyChecked,
  setNotReadyChecked,
  shippedChecked,
  setShippedChecked,
  notShippedChecked,
  setNotShippedChecked,
  delayedChecked,
  setDelayedChecked,
  notDelayedChecked,
  setNotDelayedChecked,
  quoteChecked,
  setQuoteChecked,
  oldestChecked,
  setOldestChecked,
  searchQuery,
  setSearchQuery,
  handleMaximizeAll,
  handleMinimizeAll,
  page,
}) => {
  return (
    <div className="order-nav-container">
      <div className="row1">
        <header>
          <h1>All Orders</h1>
        </header>
      </div>
      <div className="row2">
        <OrderNavFilter
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
          page={page}
        />
      </div>
      {page === "openOrdersPage" && (
        <div className="row3">
          <button onClick={handleMaximizeAll}>
            Max All <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
          </button>
          <button onClick={handleMinimizeAll}>
            Min All <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderNav;
