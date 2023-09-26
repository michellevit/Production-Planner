import React, { useState } from "react";
import "./OpenOrdersNav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpRightAndDownLeftFromCenter,
  faDownLeftAndUpRightToCenter,
} from "@fortawesome/free-solid-svg-icons";

const OpenOrdersNav = ({
  handleFilterOrders,
  handleMaximizeAll,
  handleMinimizeAll,
  handleSortChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleFilterOrders(query);
  };

  return (
    <div className="open-orders-nav-container">
      <div className="row1">
        <header>
          <h1>Open Orders</h1>
        </header>
      </div>
      <div className="row2">
        <select name="Sort by..." onChange={handleSortChange} id="mySelect">
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
            <input type="checkbox" id="ready" value="Ready" />
            <label htmlFor="ready">Ready</label>
          </li>
          <li>
            <input type="checkbox" id="notReady" value="Not Ready" />
            <label htmlFor="notReady">Not Ready</label>
          </li>
          <li>
            <input type="checkbox" id="shipped" value="Shipped" />
            <label htmlFor="shipped">Shipped</label>
          </li>
          <li>
            <input type="checkbox" id="notShipped" value="Not Shipped" />
            <label htmlFor="notShipped">Not Shipped</label>
          </li>
          <li>
            <input type="checkbox" id="delayed" value="Delayed" />
            <label htmlFor="delayed">Delayed</label>
          </li>
          <li><button onClick={handleMaximizeAll}>
          Max All <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
        </button>
        </li>
        <li>
        <button onClick={handleMinimizeAll}>
          Min All <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} />
        </button>
        </li>
        </ul>
      </div>
    </div>
  );
};

export default OpenOrdersNav;
