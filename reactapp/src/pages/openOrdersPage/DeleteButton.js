import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "./DeleteModal";
import axios from "axios";

const DeleteButton = ({ order, orders, setOrders, setIsRemoving }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleClickDeleteButton = () => {
    setShowConfirmModal(true);
  };
  const handleConfirmDelete = async () => {
    setShowConfirmModal(false);
    const deletedOrderID = order.id;
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/open-orders/${deletedOrderID}/`
      );
      if (isMounted) {
        setIsRemoving(true);
        setTimeout(() => {
          setOrders(
            orders.filter((orderItem) => orderItem.id !== deletedOrderID)
          );
          setIsRemoving(false);
        }, 300);
      }
    } catch (error) {
      console.error(
        "Error deleting the order. Server responded with:",
        error.response.status
      );
    }
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
      <button  id="delete-order-button" onClick={handleClickDeleteButton}>
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
