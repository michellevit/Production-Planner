import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faTruck } from "@fortawesome/free-solid-svg-icons";
// Import Components
import BoxForm from "./BoxForm";
import BoxList from "./BoxList";
import ConfirmOrder from "./ConfirmOrder";

const Order = () => {
  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");
  const [boxes, setBoxes] = useState([]);
  const [formDisplay, setFormDisplay] = useState("showForm");
  const [hideButtons, setButtonStatus] = useState(false);
  function handleFormChange(formStatus) {
    setFormDisplay(formStatus);
  }
  function handleButtonStatus(buttonStatus) {
    setButtonStatus(buttonStatus);
  }
  return (
    <div className="main-area">
      <div className="orders-container">
        <div className="column1">
          <p className="order-date">Date</p>
          <p className="order-number">Order#</p>
        </div>
        <div className="column2">
          <BoxForm
            setDimensions={setDimensions}
            dimensions={dimensions}
            setWeight={setWeight}
            weight={weight}
            setBoxes={setBoxes}
            boxes={boxes}
            formDisplay={formDisplay}
          />
          <BoxList
            boxes={boxes}
            setBoxes={setBoxes}
            hideButtons={hideButtons}
          />
          <ConfirmOrder
            boxes={boxes}
            handleFormChange={handleFormChange}
            handleButtonStatus={handleButtonStatus}
          />
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
