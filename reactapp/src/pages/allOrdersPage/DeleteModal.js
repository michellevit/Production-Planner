import React from "react";
import "./DeleteModal.css";


const DeleteModal = ({ show, handleConfirmDelete, handleCancelDelete, order }) => {
    if (!show) {
        return null;
      }
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-container">
        <div className="delete-modal">
        <p>
            {order?.order_number
              ? `Are you sure you want to delete SO#${order.order_number}?`
              : "Are you sure you want to delete this order?"}
          </p>
          <div className="modal-buttons">
            <button className="confirm-button" onClick={handleConfirmDelete}>
              Yes
            </button>
            <button className="cancel-button" onClick={handleCancelDelete}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;


