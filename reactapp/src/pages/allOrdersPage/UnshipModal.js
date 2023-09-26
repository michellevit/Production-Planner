import React from "react";
import "./UnshipModal.css";

const UnshipModal = ({ show, handleConfirmUnship, handleCancelUnship, order }) => {
  if (!show) {
    return null;
  }
  return (
    <div className="unship-modal-overlay">
      <div className="unship-modal-container">
        <div className="unship-modal">
        <p>
            {order?.order_number
              ? `Are you sure you want to unship SO#${order.order_number}?`
              : "Are you sure you want to unship this order?"}
          </p>
          <div className="unship-modal-buttons">
            <button className="unship-confirm-button" onClick={handleConfirmUnship}>
              Yes
            </button>
            <button className="unship-cancel-button" onClick={handleCancelUnship}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnshipModal;