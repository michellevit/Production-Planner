import React, { useState } from "react";
import "./AllOrdersNav.css";


const AllOrdersNav = ( { 
  handleAllSortChange,
  delayedChecked,
  setDelayedChecked,
  oldestChecked,
  setOldestChecked,
} ) => {
  const [searchQuery, setSearchQuery] = useState("");


  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // handleFilterOrders(query);
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
            onChange={handleAllSortChange}
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
          <li><input type="checkbox" id="ready" value="Ready" /><label htmlFor="ready">Ready</label></li>
          <li><input type="checkbox" id="notReady" value="Not Ready" /><label htmlFor="notReady">Not Ready</label></li>
          <li><input type="checkbox" id="shipped" value="Shipped" /><label htmlFor="shipped">Shipped</label></li>
          <li><input type="checkbox" id="notShipped" value="Not Shipped" /><label htmlFor="notShipped">Not Shipped</label></li>
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
