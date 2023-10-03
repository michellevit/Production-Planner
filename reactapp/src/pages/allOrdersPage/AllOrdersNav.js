import React, { useState } from "react";
import "./AllOrdersNav.css";


const AllOrdersNav = ( { 
  handleSortChange,
  handleSearchOrders,
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
  oldestChecked,
  setOldestChecked,
  searchQuery,
  setSearchQuery,
} ) => {
  


  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearchOrders(query);
  };


  return (
    <div className="all-orders-nav-container">
      <div className="row1">
      <header>
        <h1>All Orders</h1>
      </header>
      </div>
      <div className="row2">
        <select
            name="Sort by..."
            onChange={handleSortChange}
            id="mySelect"
          >
            <option hidden>Sort by...</option>
            <option value="All">All</option>
            <option disabled={true}>--------</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Past">Past</option>
            <option disabled={true}>--------</option>
            <option value="Today">Today</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="This-Week">This Week</option>
            <option value="Next-Week">Next Week</option>
            <option value="This-Month">This Month</option>
            <option disabled={true}>--------</option>
            <option value="Last-Week">Last Week</option>
            <option value="Last-Month">Last Month</option>
          </select>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
      <div className="row3">
        <ul>
        <li>
            <input
              type="checkbox"
              id="ready"
              value="Ready"
              checked={readyChecked}
              onChange={() => setReadyChecked(!readyChecked)}
            />
            <label htmlFor="ready">Ready</label>
          </li>
          <li>
            <input
              type="checkbox"
              id="notReady"
              value="Not Ready"
              checked={notReadyChecked}
              onChange={() => setNotReadyChecked(!notReadyChecked)}
            />
            <label htmlFor="notReady">Not Ready</label>
          </li>
          <li>
            <input
              type="checkbox"
              id="shipped"
              value="Shipped"
              checked={shippedChecked}
              onChange={() => setShippedChecked(!shippedChecked)}
            />
            <label htmlFor="shipped">Shipped</label>
          </li>
          <li>
            <input
              type="checkbox"
              id="notShipped"
              value="Not Shipped"
              checked={notShippedChecked}
              onChange={() => setNotShippedChecked(!notShippedChecked)}
            />
            <label htmlFor="notShipped">Not Shipped</label>
          </li>
          <li>
            <input
              type="checkbox"
              id="delayed"
              value="Delayed"
              checked={delayedChecked}
              onChange={() => setDelayedChecked(!delayedChecked)}
            />
            <label htmlFor="delayed">Delayed</label>
          </li>
          <li>
            <input
              type="checkbox"
              id="oldest"
              value="Oldest"
              checked={oldestChecked}
              onChange={() => setOldestChecked(!oldestChecked)}
            />
            <label htmlFor="oldest">Oldest</label>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AllOrdersNav;
