import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import DeleteButton from "./DeleteButton";
import BoxForm from "./BoxForm";
import BoxList from "./BoxList";
import NoteList from "./NoteList";
import "./OrderCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faTruckFast,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

const OrderCard = ({ order, orders, setOrders }) => {
  const [startDate, setStartDate] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [formDisplay, setFormDisplay] = useState(true);
  const [buttonDisplay, setButtonDisplay] = useState(true);
  const [notes, setNotes] = useState([]);
  const [readyStatus, setReadyStatus] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(false);
  const handleOrderDelete = (deletedOrderId) => {
    setOrders(orders.filter(order => order.id !== deletedOrderId));
  };
  const handleConfirmButtonStatus = () => {
    if (confirmStatus) {
      boxes.map((box) => ({ ...box, setConfirmStatus: true }));
    } else {
      boxes.map((box) => ({ ...box, setConfirmStatus: false }));
    }
  };
  const readyHandler = () => {
    setReadyStatus((prevState) => !prevState);
    if (readyStatus) {
      if (!confirmStatus) {
        setConfirmStatus(true);
        confirmHandler(true);
      }
    }
  };
  const confirmHandler = () => {
    if (confirmStatus) {
      setFormDisplay(true);
      setButtonDisplay(true);
      handleConfirmButtonStatus(false);
    } else {
      setFormDisplay(false);
      setButtonDisplay(false);
      handleConfirmButtonStatus(true);
    }
  };
  return (
    <div className={`card-container ${readyStatus ? "ready-order-card" : ""}`}>
      {!readyStatus && (
        <div className="row" id="row1">
          <DeleteButton
            readyStatus={readyStatus}
            order={order}
            handleOrderDelete={handleOrderDelete}
          />
        </div>
      )}
      <div className="row" id="row2">
        <div className="order-number-container">
        <div className="order-number-text">SO# {order.order_number}</div>
        </div>
      </div>
      <div className="row" id="row3">
        <table className="card-data-table">
          <tbody>
            <tr className="order-data" id="customer-name">
              <td className="col1">Customer:</td>
              <td className="col2">{order.customer_name}</td>
            </tr>
            <tr className="order-data" id="ship-date">
              <td className="col1">Ship Date:</td>
              <td className="col2">{order.ship_date}</td>
            </tr>
            {!readyStatus && (
              <tr className="order-data" id="delay-date">
                <td className="col1">Delay:</td>
                <td className="col2">
                  <DatePicker
                    showIcon
                    placeholderText="n/a"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    isClearable
                    className="delay-input"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="row" id="row4">
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
      <div className="row" id={readyStatus && notes.length === 0 ? 'row5-ready-nonotes' : 'row5'}>
        <div className="dimensions-container">
          {boxes.length === 0 && readyStatus ? (
          <p className="no-box-message">No dimensions/weight info. added.</p>) : ""}
          <BoxForm
            formDisplay={formDisplay}
            setFormDisplay={setFormDisplay}
            setButtonDisplay={setButtonDisplay}
            setBoxes={setBoxes}
            boxes={boxes}
            setConfirmStatus={setConfirmStatus}
            confirmStatus={confirmStatus}
            readyStatus={readyStatus}
          />
          {boxes.length > 0 && (
            <BoxList
              boxes={boxes}
              setBoxes={setBoxes}
              setFormDisplay={setFormDisplay}
              buttonDisplay={buttonDisplay}            
              setButtonDisplay={setButtonDisplay}
              confirmStatus={confirmStatus}
              handleConfirmButtonStatus={handleConfirmButtonStatus}
              setConfirmStatus={setConfirmStatus}
              confirmHandler={confirmHandler}
              readyStatus={readyStatus}
            />
          )}
        </div>
      </div>
      {!(readyStatus && notes.length === 0) && (
      <div className="row" id="row6">
        <div className="note-container">
          <NoteList 
          readyStatus={readyStatus}
          notes={notes}
          setNotes={setNotes}
          />
        </div>
      </div>
      )}
      <div className="row" id="row7">
        <div className="row7-buttons-container">
          {!readyStatus && (
          <button type="button" id="ready" onClick={readyHandler}>
            <FontAwesomeIcon icon={faBox} />
            &nbsp;Ready
          </button>
          )}
          {readyStatus && (
          <button type="button" id="edit" onClick={readyHandler}>
            <FontAwesomeIcon icon={faEdit} />
            &nbsp;Edit
          </button>
          )}
          {readyStatus && (
            <button type="button" id="shipped">
              <FontAwesomeIcon icon={faTruckFast} />
              &nbsp;Shipped
            </button>
          )}

        </div>
      </div>
      </div>
  );
};
export default OrderCard;
