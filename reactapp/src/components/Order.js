import React, { useState } from "react";
// Import Components
import BoxForm from "./BoxForm";
import BoxList from "./BoxList";

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
          <BoxList boxes={boxes} />
        </div>
        <div className="column3">
          <button type="button" id="picked-up">
            Collected
          </button>
          <button type="button" id="delete">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
