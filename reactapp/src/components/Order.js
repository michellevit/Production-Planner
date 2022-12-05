import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faTruck } from "@fortawesome/free-solid-svg-icons";
// Import Components
import BoxForm from "./BoxForm";
import BoxList from "./BoxList";
import Box from "./Box";

const Order = () => {
  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");
  const [boxes, setBoxes] = useState([]);
  return (
    <div className="main-area">
      <div className="orders-container">
        <div className="column1">
          <p className="order-date">Date</p>
          <p className="order-number">Order Number</p>
        </div>
        <div className="column2">
          <BoxForm
            setDimensions={setDimensions}
            dimensions={dimensions}
            setWeight={setWeight}
            weight={weight}
            setBoxes={setBoxes}
            boxes={boxes}
          />
          <BoxList boxes={boxes} setBoxes={setBoxes} Box={Box} />
        </div>
        <div className="column3">
          <button type="button" id="picked-up">
            <FontAwesomeIcon icon={faTruck} />
          </button>
          <button type="button" id="delete">
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
