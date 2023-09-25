import React, { useState } from "react";
import "./OpenOrdersNav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMaximize, faMinimize } from "@fortawesome/free-solid-svg-icons";

const OpenOrdersNav = ({ openOrders, setOpenOrders, handleFilterOrders }) => {
  const [searchQuery, setSearchQuery] = useState("");

const handleExpandAll = () => {
  console.log('hi');
};
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleFilterOrders(query);
  };

  return (
    <div className="open-orders-nav-container">
      <div className="col1">
        <button onClick={handleExpandAll}>
          Expand All <FontAwesomeIcon icon={faMaximize} />
        </button>
        <button>
          Minimize All <FontAwesomeIcon icon={faMinimize} />
        </button>
      </div>
      <div className="col2"></div>
      <div className="col3">
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
