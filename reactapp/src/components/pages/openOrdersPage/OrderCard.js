import React, { useState, useEffect } from "react";
import axios from "axios";
import BoxForm from "./BoxForm";
import BoxList from "./BoxList";
import "./OrderCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faTruck, faClock } from "@fortawesome/free-solid-svg-icons";

const OrderCard = ({ order }) => {
  const [orders, setOrders] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [formDisplay, setFormDisplay] = useState(true);
  const [buttonDisplay, setButtonDisplay] = useState(true);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/open-orders/")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error getting data", error);
      });
  }, []);
  return (
    <div className="card-container" id={order.id}>
      <div className="order-number">SO# {order.order_number}</div>
      <div className="row" id="row1">
        <table className="card-data-table">
          <tr className="order-data" id="customer-name">
            <td className="col1">Customer:</td>
            <td className="col2">{order.customer_name}</td>
          </tr>
        </table>
      </div>
      <div className="row" id="row2">
        <table className="items-table">
          <tbody>
            <tr>
              <th>Item</th>
              <th id="qty">Qty.</th>
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
            setBoxes={setBoxes}
            boxes={boxes}
            formDisplay={formDisplay}
          />
          {boxes.length > 0 && (
            <BoxList
              boxes={boxes}
              setBoxes={setBoxes}
              buttonDisplay={buttonDisplay}
              setFormDisplay={setFormDisplay}
              setButtonDisplay={setButtonDisplay}
            />
          )}
        </div>
      </div>
      <div className="row" id="row4">
        <div className="row4-buttons-container">
          <button type="button" id="delay">
            Delay&nbsp;
            <FontAwesomeIcon icon={faClock} />
          </button>
          <button type="button" id="delay">
            Delay&nbsp;
            <FontAwesomeIcon icon={faClock} />
          </button>
          <button type="button" id="picked-up">
            Picked Up&nbsp;
            <FontAwesomeIcon icon={faTruck} />
          </button>
          <button type="button" id="delete">
            Delete&nbsp;
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default OrderCard;
