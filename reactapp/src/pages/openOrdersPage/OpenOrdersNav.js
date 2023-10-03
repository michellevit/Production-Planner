import React, { useState } from "react";
import "./OpenOrdersNav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpRightAndDownLeftFromCenter,
  faDownLeftAndUpRightToCenter,
} from "@fortawesome/free-solid-svg-icons";

const OpenOrdersNav = ({
  handleSearchOrders,
  handleMaximizeAll,
  handleMinimizeAll,
  handleSortChange,
  readyChecked,
  setReadyChecked,
  notReadyChecked,
  setNotReadyChecked,
  delayedChecked,
  setDelayedChecked,
  oldestChecked,
  setOldestChecked,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearchOrders(query);
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
          <li>
            <button onClick={handleMaximizeAll}>
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
