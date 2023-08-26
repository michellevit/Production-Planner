
import React from "react";
import "./DeleteModal.css";

const DeleteModal = ({ show, onConfirm, onCancel }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="delete-order-modal">
      <p>Are you sure you would like to delete this order?</p>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default DeleteModal;