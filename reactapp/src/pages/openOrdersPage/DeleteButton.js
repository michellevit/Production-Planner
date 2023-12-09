import React, { useState } from "react";
import "./DeleteButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "./DeleteModal";
import axios from "axios";

const DeleteButton = ({ order, orders, setOrders, setIsRemoving }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleClickDeleteButton = () => {
    setShowConfirmModal(true);
  };
  const handleConfirmDelete = () => {
    setShowConfirmModal(false);
    const deletedOrderID = order.id
    axios
      .delete(`http://127.0.0.1:8000/open-orders/${deletedOrderID}/`)
      .catch((error) => {
        console.error(
          "Error deleting the order. Server responded with:",
          error.response.status
        );
      });
      setIsRemoving(true);
      setTimeout(() => {
        setOrders(orders.filter((orderItem) => orderItem.id !== deletedOrderID));
        setIsRemoving(false);
      }, 300);
  };
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };
  return (
    <div>
          <button id="delete-order-button" onClick={handleClickDeleteButton}>
            <FontAwesomeIcon icon={faClose} />
          </button>
          <DeleteModal
            show={showConfirmModal}
            handleConfirmDelete={handleConfirmDelete}
            handleCancelDelete={handleCancelDelete}
            order={order}
          />
    </div>
  );
};

export default DeleteButton;
