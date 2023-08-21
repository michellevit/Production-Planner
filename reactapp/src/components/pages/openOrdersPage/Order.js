import React, { useState, useEffect } from "react";
import axios from 'axios'
import "./Order.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faTruck } from "@fortawesome/free-solid-svg-icons";
// Import Components
import BoxForm from "./BoxForm";
import BoxList from "./BoxList";
import ConfirmOrder from "./ConfirmOrder";


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
        <div className="cards-container">
          <div className="single-card-container">
            <div className="single-card-data">
            <div className="row1">
                <p className="ship-date">{formatDate(order.ship_date)}</p>
                <p className="order-number">{order.order_number}</p>
                <p className="customer">{order.customer_name}</p>
            </div>
            <div className="row2">
              <div className="items-table">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(order.item_subtype_dict).map((itemType, index) => (
                      <tr key={index}>
                        <td>{itemType}</td>
                        <td className="qty">{order.item_subtype_dict[itemType]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>              
            </div>
            <div className="row3">
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
                handleFormChange={handleFormChange}
                handleButtonStatus={handleButtonStatus}
              />
            </div>
            <div className="row4">
              <button>Delayed</button>
              <button type="button" id="picked-up"><FontAwesomeIcon icon={faTruck} /></button>
              <button type="button" id="delete"><FontAwesomeIcon icon={faClose} /></button>
            </div>
          </div>
        </div> 
        </div>
        ))}
      </div>
    );
  };
  
  export default Order;

