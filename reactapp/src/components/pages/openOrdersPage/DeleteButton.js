import React, { useState } from "react";
import "./DeleteButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "./DeleteModal";

const DeleteButton = ({ readyStatus, onDelete }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteOrder = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirmModal(false);
    onDelete(); // Call the onDelete prop to actually delete the order
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="delete-order-container">
      {!readyStatus && (
        <>
          <button onClick={handleDeleteOrder}>
            <FontAwesomeIcon icon={faClose} />
          </button>
          <DeleteModal
            show={showConfirmModal}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </>
      )}
    </div>
  );
};

export default DeleteButton;