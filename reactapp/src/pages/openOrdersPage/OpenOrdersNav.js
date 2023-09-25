import React, { useState } from "react";
import "./OpenOrdersNav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMaximize, faMinimize } from "@fortawesome/free-solid-svg-icons";

const OpenOrdersNav = ({ handleFilterOrders }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleExpandAll = () => {
    console.log("handleExpandAll");
  };

  const sortHandler = () => {
    console.log("sortHandler");
  };

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
        <button onClick={handleExpandAll}>
          Expand All <FontAwesomeIcon icon={faMaximize} />
        </button>
        <button>
          Minimize All <FontAwesomeIcon icon={faMinimize} />
        </button>
        <select
            name="Sort by..."
            onChange={sortHandler}
            id="mySelect"
          >
            <option hidden>Sort by...</option>
            <option value="All">All</option>
            <option disabled="true">--------</option>
            <option value="Today">Today</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option disabled="true">--------</option>
            <option value="Ready">Ready</option>
            <option value="Ready">Not Ready</option>
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

export default OpenOrdersNav;
