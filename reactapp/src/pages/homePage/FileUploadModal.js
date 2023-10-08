import React from "react";
import "./FileUploadModal.css";

const FileUploadModal = ({
  showFileUploadModal,
  setShowFileUploadModal,
  fileExtension,
  setFileExtension,
}) => {
  if (!showFileUploadModal) {
    return null;
  }
  const handleConfirmDelete = () => {
    setShowFileUploadModal(false);
    setFileExtension("");
  };
  return (
    <div className="file-upload-modal-overlay">
      <div className="file-upload-modal-container">
        <div className="file-upload-modal">
          <p>The uploaded file is incompatible.</p>
          <p>Uploaded file type: <b>.{fileExtension}</b></p>
          <p>Correct file type: <b>.xlsx</b></p>
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
