import React, { useState } from "react";
import "./DeleteButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "./DeleteModal";
import axios from "axios";

const DeleteButton = ({ order, setAllOrders, isRemoving, setIsRemoving }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleClickDeleteButton = () => {
    setShowConfirmModal(true);
  };
  const handleConfirmDelete = () => {
    setShowConfirmModal(false);
    const deletedOrderID = order.id;
    setAllOrders((prevOrders) =>
      prevOrders.map((orderItem) =>
        orderItem.id === deletedOrderID
          ? { ...orderItem, isRemoving: true }
          : orderItem
      )
    );
    axios
      .delete(`http://127.0.0.1:8000/all-orders/${deletedOrderID}/`)
      .catch((error) => {
        console.error(
          "Error deleting the order. Server responded with:",
          error.response.status
        );
      });
    setTimeout(() => {
      setAllOrders((prevOrders) =>
        prevOrders.filter((orderItem) => orderItem.id !== deletedOrderID)
      );
    }, 500);
  };
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };
  return (
    <div className="all-orders-delete-div">
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
