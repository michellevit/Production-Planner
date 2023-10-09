import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import MinimizeCardButton from "./MinimizeCardButton";
import DeleteButton from "./DeleteButton";
import BoxForm from "./BoxForm";
import BoxList from "./BoxList";
import NoteList from "./NoteList";
import ReadyButton from "./ReadyButton";
import EditButton from "./EditButton";
import ShippedButton from "./ShippedButton";
import "./OrderCard.css";
import "react-datepicker/dist/react-datepicker.css";

const OrderCard = ({ order, openOrders, setOpenOrders }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [delayDate, setDelayDate] = useState();
  const [boxes, setBoxes] = useState([]);
  const [minimized, setMinimized] = useState(order.minimized_status);
  const [boxConfirmStatus, setBoxConfirmStatus] = useState([]);
  const [formDisplay, setFormDisplay] = useState([]);
  const [notes, setNotes] = useState([]);
  const [readyStatus, setReadyStatus] = useState(false);
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/open-orders/${order.id}/`
        );
        if (response.data) {
          const { ready, delay_date, packages_array, notes_array } =
            response.data;
          const updatedBoxes = Array.isArray(packages_array)
            ? packages_array.map((box) => {
                if (typeof box.boxConfirmStatus === "undefined") {
                  box.boxConfirmStatus = false;
                  setFormDisplay(true);
                } else if (box.boxConfirmStatus) {
                  setFormDisplay(false);
                  setBoxConfirmStatus(true);
                } else if (box.boxConfirmStatus === false) {
                  setFormDisplay(true);
                  setBoxConfirmStatus(false);
                }
                return box;
              })
            : [];
          const formattedDelayDate = delay_date ? parseISO(delay_date) : null;
          setDelayDate(formattedDelayDate);
          setBoxes(updatedBoxes);
          setNotes(notes_array);
          setReadyStatus(ready);
          setMinimized(order.minimized_status);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    fetchOrderDetails();
  }, [order.id, order.minimized_status]);

  const readyHandler = async () => {
    setReadyStatus(true);
    setBoxConfirmStatus(true);
    boxFormHandler();
    setDelayDate(null);
    const updatedOrder = order;
    updatedOrder.ready = true;
    updatedOrder.delay_date = null;
    try {
      await axios.put(
        `http://127.0.0.1:8000/open-orders/${order.id}/`,
        updatedOrder
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const editHandler = async () => {
    setReadyStatus(false);
    const updatedOrder = order;
    updatedOrder.ready = false;
    try {
      await axios.put(
        `http://127.0.0.1:8000/open-orders/${order.id}/`,
        updatedOrder
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const shippedHandler = async () => {
    console.log("shippedHandler()");
    const shippedOrderID = order.id;
    const updatedOrder = order;
    updatedOrder.shipped = true;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedCurrentDate = `${year}-${month}-${day}`;
    updatedOrder.ship_date = formattedCurrentDate;
    updatedOrder.minimized = true;
    try {
      await axios.put(
        `http://127.0.0.1:8000/open-orders/${order.id}/`,
        updatedOrder
      );
      setIsRemoving(true);
      setTimeout(() => {
        setOpenOrders(
          openOrders.filter((orderItem) => orderItem.id !== shippedOrderID)
        );
        setIsRemoving(false);
      }, 300);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const updateDelayDate = async (date) => {
    try {
      const formattedDate = date ? date.toISOString().split("T")[0] : null;
      const updatedOrder = order;
      updatedOrder.delay_date = formattedDate;
      await axios.put(
        `http://127.0.0.1:8000/open-orders/${order.id}/`,
        updatedOrder
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const boxFormHandler = () => {
    if (readyStatus) {
      setFormDisplay(false);
      setBoxConfirmStatus(true);
      handleBoxConfirmStatus(true);
    } else {
      setFormDisplay(true);
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
      const updatedOrder = order;
      updatedOrder.packages_array = boxes;
      await axios.put(
        `http://127.0.0.1:8000/open-orders/${order.id}/`,
        updatedOrder
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  const updateNotes = async (newNotes) => {
    try {
      const updatedOrder = order;
      updatedOrder.notes_array = newNotes;
      console.log("Sending updatedOrder:", updatedOrder);
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
      className={`card-container ${
        order.quote && readyStatus
          ? "quoted-order-card"
          : order.quote
          ? "quote-order-card"
          : readyStatus
          ? "ready-order-card"
          : ""
      } ${isRemoving ? "card-container-fade-out" : ""} ${
        delayDate !== null && !readyStatus ? "delayed-order-card" : ""
      }`}
    >
      <div className="row" id="row1">
        <div id="row1-row1">
          <div id="row1col1"></div>
          <div className="order-number-container" id="row1col2">
            <div className="order-number-text">
              {order.quote ? "Quote#" : `SO#`} {order.order_number}
            </div>
          </div>
          <div id="row1col3">
            <MinimizeCardButton
              order={order}
              minimized={minimized}
              setMinimized={setMinimized}
            />
            <DeleteButton
              order={order}
              openOrders={openOrders}
              setOpenOrders={setOpenOrders}
              setIsRemoving={setIsRemoving}
            />
          </div>
        </div>
        {minimized ? (
          <div id="min-customer-info">
            {order.customer_name}
            <br></br>
            {order.ship_date}
          </div>
        ) : null}
      </div>
      {!minimized && (
        <div className="row" id="row2">
          <table className="card-data-table">
            <tbody>
              <tr className="order-data" id="customer-name">
                <td className="row2col1">Customer:</td>
                <td className="row2col2">{order.customer_name}</td>
              </tr>
              <tr className="order-data" id="ship-date">
                <td className="row2col1">Ship Date:</td>
                <td className="row2col2">{order.ship_date}</td>
              </tr>
              {!readyStatus && (
                <tr className="order-data" id="delay-date">
                  <td className="row2col1">Delay:</td>
                  <td className="row2col2">
                    <DatePicker
                      suffixIcon={null}
                      placeholderText="n/a"
                      selected={delayDate}
                      onChange={(date) => {
                        updateDelayDate(date);
                        setDelayDate(date);
                      }}
                      isClearable
                      className="delay-input"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {!minimized && (
        <div className="row" id="row3">
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
      )}
      {!minimized && (
        <div
          className="row"
          id={readyStatus && notes.length === 0 ? "row4-ready-nonotes" : "row4"}
        >
          <div className="dimensions-container">
            {boxes.length === 0 && readyStatus ? (
              <p className="no-box-message">
                No dimensions/weight info. added.
              </p>
            ) : (
              ""
            )}
            <BoxForm
              formDisplay={formDisplay}
              setFormDisplay={setFormDisplay}
              setBoxes={setBoxes}
              boxes={boxes}
              boxConfirmStatus={boxConfirmStatus}
              setBoxConfirmStatus={setBoxConfirmStatus}
              readyStatus={readyStatus}
              updatePackages={updatePackages}
            />
            {boxes.length > 0 && (
              <BoxList
                boxes={boxes}
                setBoxes={setBoxes}
                readyStatus={readyStatus}
                updatePackages={updatePackages}
              />
            )}
          </div>
        </div>
      )}
      {!minimized && !(readyStatus && notes.length === 0) && (
        <div className="row" id="row5">
          <div className="note-container">
            <NoteList
              readyStatus={readyStatus}
              notes={notes}
              setNotes={setNotes}
              updateNotes={updateNotes}
            />
          </div>
        </div>
      )}
      {!minimized && (
        <div className="row" id="row6">
          <div className="row6-buttons-container">
            {!readyStatus && (
              <ReadyButton readyHandler={readyHandler} order={order} />
            )}
            {readyStatus && <EditButton editHandler={editHandler} />}
            {readyStatus && !order.quote && (
              <ShippedButton
                shippedHandler={shippedHandler}
                setIsRemoving={setIsRemoving}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default OrderCard;
