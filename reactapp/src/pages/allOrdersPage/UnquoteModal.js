import React from "react";
import "./UnquoteModal.css";

const UnquoteModal = ({
  showUnquoteModal,
  handleConfirmUnquote,
  handleCancelUnquote,
  order,
}) => {
  if (!showUnquoteModal) {
    return null;
  }
  return (
    <div className="unquote-modal-overlay">
      <div className="unquote-modal-container">
        <div className="unquote-modal">
          <p>
            {order?.order_number
              ? `Would you like to convert Quote# ${order.order_number} into a Sales Order?`
              : "Would you like to change this Quote into a Sales Order?"}
          </p>
          <div className="unquote-modal-buttons">
            <button
              className="unquote-confirm-button"
              onClick={handleConfirmUnquote}
            >
              Yes
            </button>
            <button
              className="unquote-cancel-button"
              onClick={handleCancelUnquote}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnquoteModal;
