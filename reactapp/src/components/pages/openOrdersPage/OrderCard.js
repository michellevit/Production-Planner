import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import DeleteButton from "./DeleteButton";
import BoxForm from "./BoxForm";
import BoxList from "./BoxList";
import NoteList from "./NoteList";
import ReadyButton from "./ReadyButton";
import EditButton from "./EditButton";
import ShippedButton from "./ShippedButton";
import "./OrderCard.css";
import "react-datepicker/dist/react-datepicker.css";

const OrderCard = ({ order, orders, setOrders }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [formDisplay, setFormDisplay] = useState([]);
  const [buttonDisplay, setButtonDisplay] = useState([]);
  const [notes, setNotes] = useState([]);
  const [readyStatus, setReadyStatus] = useState(order.ready);
  const [boxConfirmStatus, setBoxConfirmStatus] = useState([]);
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/open-orders/${order.id}/`
        );
        if (response.data) {
          const { ready, packages_array, notes_array } = response.data;
          const updatedBoxes = packages_array.map((box) => {
            if (typeof box.boxConfirmStatus === "undefined") {
              box.boxConfirmStatus = false;
              setFormDisplay(true);
            } else if (box.boxConfirmStatus) {
              setFormDisplay(false);
              setButtonDisplay(false);
              setBoxConfirmStatus(true);
            } else if (box.boxConfirmStatus === false) {
              setFormDisplay(true);
              setButtonDisplay(true);
              setBoxConfirmStatus(false);
            }
            return box;
          });
          setReadyStatus(ready);
          setBoxes(updatedBoxes);
          setNotes(notes_array);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    fetchOrderDetails();
  }, [order.id]);
  const readyHandler = () => {
    setReadyStatus((prevReadyStatus) => {
      const newReadyStatus = !prevReadyStatus;
      updateReadyStatus(newReadyStatus);
      return newReadyStatus;
    });
    if (!boxConfirmStatus) {
      setBoxConfirmStatus(true);
      boxConfirmHandler(true);
    }
  };
  const boxConfirmHandler = (boxConfirmStatus) => {
    if (boxConfirmStatus) {
      setFormDisplay(false);
      setButtonDisplay(false);
      handleBoxConfirmStatus(true);
    } else {
      setFormDisplay(true);
      setFormDisplay(true);
      setButtonDisplay(true);
      handleBoxConfirmStatus(false);
    }
  };
  const handleBoxConfirmStatus = (boxConfirmStatus) => {
    if (boxConfirmStatus) {
      setBoxes((prevBoxes) => {
        const newBoxes = prevBoxes.map((box) => ({
          ...box,
          boxConfirmStatus: true,
        }));
        updatePackages(newBoxes);
        return newBoxes;
      });
    } else {
      setBoxes((prevBoxes) => {
        const newBoxes = prevBoxes.map((box) => ({
          ...box,
          boxConfirmStatus: false,
        }));
        updatePackages(newBoxes);
        return newBoxes;
      });
    }
  };
  const updatePackages = async (boxes) => {
    try {
      const updatedOrder = {
        ...order,
        packages_array: boxes,
      };
      await axios.put(
        `http://127.0.0.1:8000/open-orders/${order.id}/`,
        updatedOrder
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  const updateReadyStatus = async (readyStatus) => {
    try {
      const updatedOrder = {
        ...order,
        ready: readyStatus,
      };
      await axios.put(
        `http://127.0.0.1:8000/open-orders/${order.id}/`,
        updatedOrder
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  return (
    <div
      className={`card-container ${readyStatus ? "ready-order-card" : ""} ${
        isRemoving ? "card-container-fade-out" : ""
      } ${startDate ? "delayed-order-card" : ""}`}
    >
      {!readyStatus && (
        <div className="row" id="row1">
          <DeleteButton
            readyStatus={readyStatus}
            order={order}
            orders={orders}
            setOrders={setOrders}
            setIsRemoving={setIsRemoving}
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
              <th id="item">Item</th>
              <th id="qty">Qty.</th>
            </tr>
            {Object.keys(order.item_subtype_dict).map((itemType, index) => (
              <tr key={index}>
                <td id="item">{itemType}</td>
                <td id="qty">{order.item_subtype_dict[itemType]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className="row"
        id={readyStatus && notes.length === 0 ? "row5-ready-nonotes" : "row5"}
      >
        <div className="dimensions-container">
          {boxes.length === 0 && readyStatus ? (
            <p className="no-box-message">No dimensions/weight info. added.</p>
          ) : (
            ""
          )}
          <BoxForm
            formDisplay={formDisplay}
            setFormDisplay={setFormDisplay}
            setButtonDisplay={setButtonDisplay}
            setBoxes={setBoxes}
            boxes={boxes}
            setBoxConfirmStatus={setBoxConfirmStatus}
            boxConfirmStatus={boxConfirmStatus}
            readyStatus={readyStatus}
            updatePackages={updatePackages}
          />
          {boxes.length > 0 && (
            <BoxList
              boxes={boxes}
              setBoxes={setBoxes}
              setFormDisplay={setFormDisplay}
              buttonDisplay={buttonDisplay}
              setButtonDisplay={setButtonDisplay}
              boxConfirmStatus={boxConfirmStatus}
              setBoxConfirmStatus={setBoxConfirmStatus}
              boxConfirmHandler={boxConfirmHandler}
              readyStatus={readyStatus}
              updatePackages={updatePackages}
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
          {!readyStatus && <ReadyButton readyHandler={readyHandler} />}
          {readyStatus && <EditButton readyHandler={readyHandler} />}
          {readyStatus && <ShippedButton />}
        </div>
      </div>
    </div>
  );
};
export default OrderCard;
