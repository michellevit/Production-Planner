import React, { useState } from "react";
import "./AllOrdersNav.css";


const AllOrdersNav = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleAllSortChange = (e) => {
    console.log('hi')
  };


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
            <option value="Upcoming">Upcoming</option>
            <option value="Past">Past</option>
            <option disabled={true}>--------</option>
            <option value="Today">Today</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="This-Week">This Week</option>
            <option value="Next-Week">Next Week</option>
            <option value="This-Month">This Month</option>
            <option value="Last-Week">Last Week</option>
            <option value="Last-Month">Last Month</option>
            <option disabled={true}>--------</option>
            <option value="Ready">Ready</option>
            <option value="Not-Ready">Not Ready</option>
            <option value="Delayed">Shipped</option>
            <option value="Delayed">Not Shipped</option>
            <option value="Delayed">Delayed</option>
          </select>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
    </div>
  );
};

export default AllOrdersNav;
