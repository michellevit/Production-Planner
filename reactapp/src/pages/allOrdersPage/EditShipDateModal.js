import React from "react";
import "./EditShipDateModal.css";

const EditShipDateModal = ({
  showEditShipDateModal,
  modalMessage,
  handleConfirmEditShipDate,
  handleCancelEditShipDate,
}) => {
  if (!showEditShipDateModal) {
    return null;
  }
  return (
    <div className="edit-ship-date-modal-overlay">
      <div className="edit-ship-date-modal-container">
        <div className="edit-ship-date-modal">
          <p>
            {modalMessage}
          </p>
          <div className="edit-ship-date-modal-buttons">
            <button
              className="edit-ship-date-confirm-button"
              onClick={handleConfirmEditShipDate}
            >
              Yes
            </button>
            <button
              className="edit-ship-date-cancel-button"
              onClick={handleCancelEditShipDate}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditShipDateModal;
