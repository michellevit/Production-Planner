import React from "react";
import "./FileUploadModal.css";

const FileUploadModal = ({
  showFileUploadModal,
  setShowFileUploadModal,
  fileExtension,
  setFileExtension,
  errorMessage,
  setErrorMessage,
}) => {
  if (!showFileUploadModal) {
    return null;
  }
  const handleConfirmDelete = () => {
    setShowFileUploadModal(false);
    setFileExtension("");
    setErrorMessage("");
  };
  return (
    <div className="file-upload-modal-overlay">
      <div className="file-upload-modal-container">
        <div className="file-upload-modal">
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

export default FileUploadModal;
