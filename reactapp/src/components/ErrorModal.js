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
  const formattedErrorMessage =
    typeof errorMessage === "string"
      ? errorMessage
      : JSON.stringify(errorMessage);
  const handleClickOK = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };
  const renderErrorMessage = () => {
    if (typeof errorMessage === 'string') {
      return <p>{errorMessage}</p>;
    }

    if (typeof errorMessage === 'object' && errorMessage !== null) {
      return (
        <>
          <p>{errorMessage.main}</p>
          <p className="error-modal-note">{errorMessage.note}</p>
        </>
      );
    }
    return null;
  };
  return (
    <div className="error-modal-overlay">
      <div className="error-modal-container">
        <div className="error-modal">
          {renderErrorMessage()}
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
