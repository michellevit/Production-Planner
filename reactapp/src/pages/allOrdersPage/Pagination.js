import React from "react";
import "./Pagination.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
    const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return (
      <ul className="pagination-list">
        {pageNumbers.map((number) => {
          const isCurrent = currentPage === number;
          return (
            <li key={number}>
              <button
                className={`pagination-button ${
                  isCurrent ? "current-page" : ""
                }`}
                onClick={() => setCurrentPage(number)}
                disabled={isCurrent}
              >
                {number}
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="pagination">
      <button
        className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      {renderPageNumbers()}
      <button
        className={`pagination-button ${
          currentPage === totalPages ? "disabled" : ""
        }`}
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  );
};

export default Pagination;
