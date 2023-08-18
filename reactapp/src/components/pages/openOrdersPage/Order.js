import React, { useState, useEffect } from "react";
import "./Order.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faTruck } from "@fortawesome/free-solid-svg-icons";
// Import Components
import BoxForm from "./BoxForm";
import BoxList from "./BoxList";
import ConfirmOrder from "./ConfirmOrder";

const Order = () => {
  // const [orders, setOrders] = useState([]);
  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");
  const [boxes, setBoxes] = useState([]);
  const [note, setNote] = useState("");
  const [formDisplay, setFormDisplay] = useState("showForm");
  const [hideButtons, setButtonStatus] = useState(false);
  const [hideNote, setNoteStatus] = useState(true);
  function handleFormChange(formStatus) {
    setFormDisplay(formStatus);
  }
  function handleButtonStatus(buttonStatus) {
    setButtonStatus(buttonStatus);
  }
  function handleNoteStatus(noteStatus) {
    setNoteStatus(noteStatus);
  }
  // useEffect(() => {
  //   fetch("http://127.0.0.1:8000/api/orders/")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       // setOrders(data);
  //     });
  // }, []);
  return (
    <div className="main-area">
      {/* {orders.map((order) => ( */}
        <div className="order-container">
          <div className="columns">
            <div className="column1">
              <p className="ship-date"></p>
              <p className="order-number"></p>
              <p className="customer"></p>
              <p className="items">Items</p>
            </div>
            <div className="column2">
              <button>Delayed</button>
              <button type="button" id="picked-up">
                <FontAwesomeIcon icon={faTruck} />
              </button>
              <button type="button" id="delete">
                <FontAwesomeIcon icon={faClose} />
              </button>
            </div>
          </div>
          <div className="column3">
            <BoxForm
              setDimensions={setDimensions}
              dimensions={dimensions}
              setWeight={setWeight}
              weight={weight}
              setBoxes={setBoxes}
              boxes={boxes}
              formDisplay={formDisplay}
              note={note}
              setNote={setNote}
              handleNoteStatus={handleNoteStatus}
            />
            <BoxList
              boxes={boxes}
              setBoxes={setBoxes}
              hideButtons={hideButtons}
              hideNote={hideNote}
              handleNoteStatus={handleNoteStatus}
            />
            <ConfirmOrder
              boxes={boxes}
              handleFormChange={handleFormChange}
              handleButtonStatus={handleButtonStatus}
            />
          </div>
        </div>
      {/* ))} */}
    </div>
  );
};

export default Order;
