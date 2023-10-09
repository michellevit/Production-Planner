import React from "react";
import "./HomeErrorModal.css";

const HomeErrorModal = ({
  showHomeErrorModal,
  setShowHomeErrorModal,
  setFileExtension,
  errorMessage,
  setErrorMessage,
}) => {
  if (!showHomeErrorModal) {
    return null;
  }
  const handleConfirmDelete = () => {
    setShowHomeErrorModal(false);
    setFileExtension("");
    setErrorMessage("");
  };
  return (
    <div className="home-error-modal-overlay">
      <div className="home-error-modal-container">
        <div className="home-error-modal">
          {errorMessage.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
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
