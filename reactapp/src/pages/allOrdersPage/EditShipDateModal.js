import React from "react";
import "./EditShipDateModal.css";

const EditShipDateModal = ({ show, handleConfirmEditShipDate, handleCancelEditShipDate, order }) => {
  if (!show) {
    return null;
  }
  return (
    <div className="edit-ship-date-modal-overlay">
      <div className="edit-ship-date-modal-container">
        <div className="edit-ship-date-modal">
        <p>
            {order?.order_number
              ? `Are you sure you want to change the ship date for SO#${order.order_number}?`
              : "Are you sure you want to change the ship date for this order?"}
          </p>
          <div className="edit-ship-date-modal-buttons">
            <button className="edit-ship-date-confirm-button" onClick={handleConfirmEditShipDate}>
              Yes
            </button>
            <button className="edit-ship-date-cancel-button" onClick={handleCancelEditShipDate}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditShipDateModal;