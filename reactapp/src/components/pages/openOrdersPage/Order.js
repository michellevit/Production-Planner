import React, { useState, useEffect } from "react";
import axios from 'axios'
import "./Order.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faTruck, faClock } from "@fortawesome/free-solid-svg-icons";
// Import Components
import BoxForm from "./BoxForm";
import BoxList from "./BoxList";


const Order = () => {
  const [orders, setOrders] = useState([]);
  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");
  const [boxes, setBoxes] = useState([]);
  const [formDisplay, setFormDisplay] = useState("showForm");
  const [hideButtons, setButtonStatus] = useState(false);
  function formatDate(dateString) {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }
  function handleFormChange(formStatus) {
    setFormDisplay(formStatus);
  }
  function handleButtonStatus(buttonStatus) {
    setButtonStatus(buttonStatus);
  }
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/open-orders/')
      .then(response => {
        setOrders(response.data);})
      .catch(error => {console.error('Error getting data', error);});
  }, []);
  return (
    <div className="main-area">
      {orders.map(order => (
        <div className="card-container" id={order.id}>
            <div className="row" id="row1">
              <table className="card-data-table">
                <tr className="order-data" id="order-number">
                  <td className="col1">Order#:</td>
                  <td className="col2">{order.order_number}</td>
                </tr>
                <tr className="order-data" id="customer-name">
                  <td className="col1">Customer:</td>
                  <td className="col2">{order.customer_name}</td>
                </tr>
                <tr className="order-data" id="ship-date">
                  <td className="col1">Ship Date:</td>
                  <td className="col2">{formatDate(order.ship_date)}</td>
                </tr>
              </table>
            </div>
            <div className="row" id="row2">
                <table className="items-table">
                  <tbody>
                    <tr>
                        <td>Item</td>
                        <td>Qty.</td>
                      </tr>
                    {Object.keys(order.item_subtype_dict).map((itemType, index) => (
                      <tr key={index}>
                        <td>{itemType}</td>
                        <td className="qty">{order.item_subtype_dict[itemType]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
            <div className="row" id="row3">
              <div className="dimensions-data">
              <BoxForm
                setDimensions={setDimensions}
                dimensions={dimensions}
                setWeight={setWeight}
                weight={weight}
                setBoxes={setBoxes}
                boxes={boxes}
                formDisplay={formDisplay}
              />
              {boxes.length > 0 && ( // Only render BoxList if there are boxes
              <BoxList
                boxes={boxes}
                setBoxes={setBoxes}
                hideButtons={hideButtons}
                handleFormChange={handleFormChange}
                handleButtonStatus={handleButtonStatus}
              />
            )}
            </div>
          </div>
          <div className="row" id="row4">
            <div className="row4-buttons-container">
              <button type="button" id="delay">Delay&nbsp;<FontAwesomeIcon icon={faClock} /></button>
              <button type="button" id="picked-up">Picked Up&nbsp;<FontAwesomeIcon icon={faTruck} /></button>
              <button type="button" id="delete">Delete&nbsp;<FontAwesomeIcon icon={faClose} /></button>
            </div>
          </div>
        </div>
        ))}
      </div>
    );
  };
  
  export default Order;

