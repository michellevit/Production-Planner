import React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesUp, faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import "./MinimizeCardButton.css";

const MinimizeCardButton = ({ order, minimized, setMinimized }) => {
  const minmaxButton = async () => {
    setMinimized(!minimized);
    const updatedOrder = order;
    updatedOrder.minimized_status = !minimized;
    try {
      await axios.put(
        `http://127.0.0.1:8000/open-orders/${order.id}/`,
        updatedOrder
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  return (
    <div>
        <button className="minButton" onClick={minmaxButton}>
          <FontAwesomeIcon icon={minimized ? faAnglesDown : faAnglesUp} />
        </button>
    </div>
  );
};

export default MinimizeCardButton;
