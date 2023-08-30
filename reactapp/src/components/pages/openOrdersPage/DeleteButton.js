import React, { useState } from "react";
import "./DeleteButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "./DeleteModal";
import axios from "axios";

const DeleteButton = ({ readyStatus, order, handleOrderDelete }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleDeleteOrder = () => {
    setShowConfirmModal(true);
  };
  const handleConfirmDelete = () => {
    setShowConfirmModal(false);
    handleOrderDelete(order.ID); 
    axios
      .delete(`http://127.0.0.1:8000/open-orders/${order.ID}/`)
      .then((response) => {
        console.log("Order deleted successfully.");
      })
      .catch((error) => {
        console.error(
          "Error deleting the order. Server responded with:",
          error.response.status
        );
      });
  };
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };
  return (
    <div className="delete-order-container">
      {!readyStatus && (
        <>
          <button id="delete-order-button" onClick={handleDeleteOrder}>
            <FontAwesomeIcon icon={faClose} />
          </button>
          <DeleteModal
            show={showConfirmModal}
            handleConfirmDelete={handleConfirmDelete}
            handleCancelDelete={handleCancelDelete}
            order={order}
          />
        </>
      )}
    </div>
  );
};

export default DeleteButton;
