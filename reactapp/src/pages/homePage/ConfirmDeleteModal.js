import React from "react";
import "./ConfirmDeleteModal.css";


const ConfirmDeleteModal = ({ showConfirmDeleteModal, handleConfirmDelete, handleCancelDelete, currentDimension }) => {
    if (!showConfirmDeleteModal) {
        return null;
      }
  return (
    <div className="confirm-delete-modal-overlay">
      <div className="confirm-delete-modal-container">
        <div className="confirm-delete-modal">
        <p>
              Are you sure you want to delete the dimension {currentDimension.package_size}?
          </p>
          <div className="confirm-delete-modal-buttons">
            <button className="confirm-delete-confirm-button" onClick={handleConfirmDelete}>
              Yes
            </button>
            <button className="confirm-delete-cancel-button" onClick={handleCancelDelete}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;


