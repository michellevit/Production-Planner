import React from "react";
import "./HomeErrorModal.css";

const HomeErrorModal = ({
  showHomeErrorModal,
  setShowHomeErrorModal,
  errorMessage,
  setErrorMessage,
}) => {
  if (!showHomeErrorModal) {
    return null;
  }
  const handleConfirmDelete = () => {
    setShowHomeErrorModal(false);
    setErrorMessage("");
  };
  return (
    <div className="home-error-modal-overlay">
      <div className="home-error-modal-container">
        <div className="home-error-modal">
          {errorMessage && <div className="error-message"><p>{errorMessage}</p></div>}
          <div className="modal-buttons">
            <button className="confirm-button" onClick={handleConfirmDelete}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeErrorModal;
