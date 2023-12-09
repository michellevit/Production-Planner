import React from "react";
import "./ErrorModal.css";

const ErrorModal = ({
  showErrorModal,
  setShowErrorModal,
  errorMessage,
  setErrorMessage,
}) => {
  if (!showErrorModal) {
    return null;
  }
  const handleClickOK = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };
  return (
    <div className="error-modal-overlay">
      <div className="error-modal-container">
        <div className="error-modal">
          {errorMessage.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
          <div className="error-modal-buttons">
            <button className="error-confirm-button" onClick={handleClickOK}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
