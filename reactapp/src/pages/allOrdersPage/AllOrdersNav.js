import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import "./AllOrdersNav.css";

const AllOrdersNav = ({
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
  quoteChecked,
  setQuoteChecked,
  oldestChecked,
  setOldestChecked,
  searchQuery,
  setSearchQuery,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

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
          value={currentView}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="all">All</option>
          <option disabled={true}>--------</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="this-week">This Week</option>
          <option value="this-month">This Month</option>
          <option disabled={true}>--------</option>
          <option value="upcoming">Upcoming</option>
          <option value="next-week">Next Week</option>
          <option value="next-month">Next Month</option>
          <option disabled={true}>--------</option>
          <option value="past">Past</option>
          <option value="last-week">Last Week</option>
          <option value="last-month">Last Month</option>
        </select>

        <div
          className={`custom-dropdown ${dropdownOpen ? "open" : ""}`}
          ref={dropdownRef}
        >
          <button onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span>Filters {numberOfFilters}</span>
            <FontAwesomeIcon icon={faAngleDown} />
          </button>
          <div className="custom-dropdown-menu">
            <label>
              <input
                type="checkbox"
                value="Confirmed"
                checked={confirmedChecked}
                onChange={() => setConfirmedChecked(!confirmedChecked)}
              />
              Confirmed
            </label>
            <label>
              <input
                type="checkbox"
                value="Not Confirmed"
                checked={notConfirmedChecked}
                onChange={() => setNotConfirmedChecked(!notConfirmedChecked)}
              />
              Not Confirmed
            </label>
            <label>
              <input
                type="checkbox"
                value="Ready"
                checked={readyChecked}
                onChange={() => setReadyChecked(!readyChecked)}
              />
              Ready
            </label>
            <label>
              <input
                type="checkbox"
                value="Not Ready"
                checked={notReadyChecked}
                onChange={() => setNotReadyChecked(!notReadyChecked)}
              />
              Not Ready
            </label>
            <label>
              <input
                type="checkbox"
                value="Shipped"
                checked={shippedChecked}
                onChange={() => setShippedChecked(!shippedChecked)}
              />
              Shipped
            </label>
            <label>
              <input
                type="checkbox"
                value="Not Shipped"
                checked={notShippedChecked}
                onChange={() => setNotShippedChecked(!notShippedChecked)}
              />
              Not Shipped
            </label>
            <label>
              <input
                type="checkbox"
                value="Delayed"
                checked={delayedChecked}
                onChange={() => setDelayedChecked(!delayedChecked)}
              />
              Delayed
            </label>
            <label>
              <input
                type="checkbox"
                value="Quote"
                checked={quoteChecked}
                onChange={() => setQuoteChecked(!quoteChecked)}
              />
              Quote
            </label>
            <label>
              <input
                type="checkbox"
                value="Oldest"
                checked={oldestChecked}
                onChange={() => setOldestChecked(!oldestChecked)}
              />
              Oldest
            </label>
          </div>
        </div>
        <input
          type="text"
          id="search"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
    </div>
  );
};

export default AllOrdersNav;
