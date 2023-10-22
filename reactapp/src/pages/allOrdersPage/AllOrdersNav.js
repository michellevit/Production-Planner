import React from "react";
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
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option hidden>Sort by...</option>
            <option value="all">All</option>
            <option disabled={true}>--------</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option disabled={true}>--------</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this-week">This Week</option>
            <option value="next-week">Next Week</option>
            <option value="this-month">This Month</option>
            <option value="next-month">Last Month</option>
            <option disabled={true}>--------</option>
            <option value="last-week">Last Week</option>
            <option value="last-month">Last Month</option>
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
