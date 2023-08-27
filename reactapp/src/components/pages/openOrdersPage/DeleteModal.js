import React from "react";
import "./DeleteModal.css";

const DeleteModal = ({ show, onConfirm, onCancel, order }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-container">
        <div className="delete-modal">
          <p>Are you sure you want to delete {order.order_number} order?</p>
          <div className="modal-buttons">
            <button className="confirm-button" onClick={onConfirm}>
              Yes
            </button>
            <button className="cancel-button" onClick={onCancel}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
