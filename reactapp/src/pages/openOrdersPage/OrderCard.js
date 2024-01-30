import axios from "axios";
import BoxForm from "./BoxForm";
import BoxList from "./BoxList";
import DatePicker from "react-datepicker";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import React, { useState, useEffect } from "react";
import MinimizeCardButton from "./MinimizeCardButton";
import NoteList from "./NoteList";
import { parseISO } from "date-fns";
import ReadyButton from "./ReadyButton";
import ShippedButton from "./ShippedButton";
import SuggestedDims from "./SuggestedDims";
import "./OrderCard.css";
import "react-datepicker/dist/react-datepicker.css";

const OrderCard = ({
  order,
  orders,
  setOrders,
  setShowErrorModal,
  setErrorMessage,
  minimizeMaximizeAction,
}) => {
  const [refreshOrders, setRefreshOrders] = useState(false);
  const [shipDate, setShipDate] = useState("");
  const [confirmedStatus, setConfirmedStatus] = useState(false);
  const [delayDate, setDelayDate] = useState();
  const [tbdStatus, setTBDStatus] = useState(false);
  const [boxes, setBoxes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [isQuote, setIsQuote] = useState();
  const [readyStatus, setReadyStatus] = useState(false);
  const [formDisplay, setFormDisplay] = useState([]);
  const [isRemoving, setIsRemoving] = useState(false);
  const [matchingDims, setMatchingDims] = useState("");
  const [suggestedBoxes, setSuggestedBoxes] = useState([]);
  const [orderCardBackground, setOrderCardBackground] = useState("");
  const [minimized, setMinimized] = useState(() => {
    const minimizedStatus = localStorage.getItem(`order_minimized_${order.id}`);
    return minimizedStatus ? JSON.parse(minimizedStatus) : true;
  });
  useEffect(() => {
    fetchOrderDetails();
    getOrderCardBackground();
    setRefreshOrders(false);
  }, [order.id, shipDate, refreshOrders, isQuote, minimizeMaximizeAction]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/open-orders/${order.id}/`
      );
      if (response.data) {
        const {
          ship_date,
          confirmed,
          delay_date,
          delay_tbd,
          packages_array,
          notes_array,
          quote,
          ready,
          item_array_hash,
        } = response.data;
        setConfirmedStatus(confirmed);
        const formattedDelayDate = delay_date ? parseISO(delay_date) : null;
        setDelayDate(formattedDelayDate);
        setTBDStatus(delay_tbd);
        setBoxes(packages_array);
        setNotes(notes_array);
        setIsQuote(quote);
        setReadyStatus(ready);
        const minimizedStatus = localStorage.getItem(
          `order_minimized_${order.id}`
        );
        setMinimized(minimizedStatus ? JSON.parse(minimizedStatus) : true);
        setShipDate(formatDate(ship_date));
        if (ship_date === null) {
          if (delay_date === null) {
            checkTBD(true);
          } else {
            checkTBD(false);
          }
        }
        if (
          packages_array.length === 0 &&
          matchingDims !== false &&
          item_array_hash !== "0"
        ) {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/fetch-matching-packages/`,
              {
                item_array: order.item_array,
              }
            );

            if (response.data.success) {
              setMatchingDims(true);
              setSuggestedBoxes(response.data.packages_array);
            } else {
              setMatchingDims(false);
            }
          } catch (error) {
            console.error("Error fetching matching packages:", error);
          }
        } else {
          setMatchingDims(false);
        }
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const getOrderCardBackground = () => {
    if (order.quote) {
      setOrderCardBackground("quoted-order-card");
    } else if (delayDate !== null && confirmedStatus) {
      setOrderCardBackground("confirmed-order-card");
    } else if (delayDate !== null || tbdStatus) {
      setOrderCardBackground("delayed-order-card");
    } else if (readyStatus) {
      setOrderCardBackground("ready-order-card");
    } else if (confirmedStatus) {
      setOrderCardBackground("confirmed-order-card");
    } else {
      setOrderCardBackground("default-order-card");
    }
  };

  function formatDate(inputDate) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const dateParts = inputDate.split("-");
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);
    const dateObj = new Date(Date.UTC(year, month, day));
    const formattedDate = `${
      months[dateObj.getUTCMonth()]
    } ${dateObj.getUTCDate()}, ${dateObj.getUTCFullYear()}`;
    return formattedDate;
  }

  const readyHandler = async () => {
    setReadyStatus(true);
    setConfirmedStatus(true);
    boxFormHandler();
    setDelayDate(null);
    setTBDStatus(false);
    console.log("readyHandler - boxes: ", boxes);
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/open-orders/${order.id}/`,
        {
          ...order,
          ready: true,
          confirmed: true,
          delay_date: null,
          delay_tbd: false,
          packages_array: boxes,
        }
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
    setRefreshOrders(true);
  };

  const editHandler = async () => {
    setReadyStatus(false);
    setConfirmedStatus(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/open-orders/${order.id}/`,
        {
          ...order,
          ready: true,
          confirmed: true,
          delay_date: null,
          delay_tbd: false,
          packages_array: boxes,
        }
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
    setRefreshOrders(true);
  };

  const shippedHandler = async () => {
    const shippedOrderID = order.id;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedCurrentDate = `${year}-${month}-${day}`;
    setIsRemoving(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/open-orders/${order.id}/`,
        {
          ...order,
          shipped: true,
          ship_date: formattedCurrentDate,
        }
      );
      setIsRemoving(true);
      setTimeout(() => {
        setOrders(
          orders.filter((orderItem) => orderItem.id !== shippedOrderID)
        );
        setIsRemoving(false);
      }, 300);
      localStorage.removeItem(`order_minimized_${order.id}`);
    } catch (error) {
      console.error("Error updating order:", error);
    }
    setRefreshOrders(true);
  };

  const updateDelayDate = async (date) => {
    try {
      const formattedDate = date ? date.toISOString().split("T")[0] : null;
      if (formattedDate !== null) {
        setTBDStatus(false);
        setConfirmedStatus(false);
      }
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/open-orders/${order.id}/`,
        {
          ...order,
          delay_date: formattedDate,
          delay_tbd: false,
          confirmed: false,
        }
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
    setRefreshOrders(true);
  };

  const checkTBD = async (tbdBoolean) => {
    setTBDStatus(tbdBoolean);
    setConfirmedStatus(false);
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/open-orders/${order.id}/`,
        {
          ...order,
          delay_tbd: tbdBoolean,
          confirmed: false,
        }
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
    setRefreshOrders(true);
  };

  const handleTBD = async () => {
    let newStatus = !tbdStatus;
    setConfirmedStatus(false);
    if (newStatus === false && order.ship_date === null) {
      newStatus = true;
    } else if (newStatus === false && order.ship_date !== null) {
      newStatus = false;
    }
    setTBDStatus(newStatus);
    setDelayDate(null);
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/open-orders/${order.id}/`,
        {
          ...order,
          delay_date: null,
          delay_tbd: newStatus,
          confirmed: false,
        }
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
    setRefreshOrders(true);
  };

  const handleConfirmed = async () => {
    let newStatus = !confirmedStatus;
    setConfirmedStatus(newStatus);
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/open-orders/${order.id}/`,
        {
          ...order,
          confirmed: newStatus,
        }
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
    setRefreshOrders(true);
  };

  const boxFormHandler = () => {
    if (readyStatus) {
      setFormDisplay(false);
    } else {
      setFormDisplay(true);
    }
  };

  const updatePackages = async (boxes) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/open-orders/${order.id}/`,
        {
          ...order,
          packages_array: boxes,
        }
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  const updateNotes = async (newNotes) => {
    try {
      const updatedOrder = order;
      updatedOrder.notes_array = newNotes;
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/open-orders/${order.id}/`,
        {
          ...order,
          notes_array: newNotes,
        }
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const toggleMinimize = () => {
    setMinimized((prevState) => {
      const newState = !prevState;
      localStorage.setItem(
        `order_minimized_${order.id}`,
        JSON.stringify(newState)
      );
      return newState;
    });
  };

  return (
    <div
      className={`card-container ${orderCardBackground} ${
        isRemoving ? "card-container-fade-out" : ""
      }`}
    >
      <div className="row" id="row1">
        <div id="row1-row1">
          <div id="row1col1"></div>
          <div className="order-number-container" id="row1col2">
            <div className="order-number-text">
              {order.quote ? "Quote#" : <span>&nbsp;&nbsp;&nbsp;</span>}{" "}
              {order.order_number}
              <MinimizeCardButton
                minimized={minimized}
                toggleMinimize={toggleMinimize}
              />
            </div>
          </div>
          <div id="row1col3">
            <DeleteButton
              order={order}
              orders={orders}
              setOrders={setOrders}
              setIsRemoving={setIsRemoving}
            />
          </div>
        </div>
        {minimized ? (
          <div id="min-customer-info">
            {order.customer_name}
            <br></br>
            {tbdStatus ? "TBD" : shipDate}
          </div>
        ) : null}
      </div>
      {!minimized && (
        <div className="row" id="row2">
          <table className="card-data-table">
            <tbody>
              <tr className="order-data" id="customer-name">
                <td className="row2col1">Customer:</td>
                <td className="row2col2" colSpan="2">
                  {order.customer_name}
                </td>
              </tr>
              <tr className="order-data" id="ship-date">
                <td className="row2col1">Ship Date:</td>
                <td className="row2col2">{tbdStatus ? "TBD" : shipDate}</td>
                <td className="row2col3">
                  {!readyStatus && !isQuote && (
                    <>
                      <input
                        type="checkbox"
                        id="order-card-confirmed-checkbox"
                        checked={confirmedStatus}
                        onChange={handleConfirmed}
                      />
                      Confirmed
                    </>
                  )}
                </td>
              </tr>
              {!readyStatus && !order.quote && (
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
                  <td className="row2col3">
                    {!order.quote && (
                      <input
                        type="checkbox"
                        id="order-card-tbd-checkbox"
                        checked={tbdStatus}
                        onChange={handleTBD}
                      ></input>
                    )}
                    {!order.quote && "TBD"}
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
              {order.item_array.map((item, index) => (
                <tr key={index}>
                  <td id="item">
                    {item.name} {item.description}
                  </td>
                  <td id="qty">
                    {item.ship_qty}
                    {item.backorder_qty > 0 && (
                      <p id="backorder-text">B/O: {item.backorder_qty}</p>
                    )}
                  </td>
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
              readyStatus={readyStatus}
              updatePackages={updatePackages}
              setShowErrorModal={setShowErrorModal}
              setErrorMessage={setErrorMessage}
            />
            {boxes.length > 0 && (
              <BoxList
                boxes={boxes}
                setBoxes={setBoxes}
                readyStatus={readyStatus}
                updatePackages={updatePackages}
              />
            )}
            {matchingDims && !readyStatus && (
              <SuggestedDims
                suggestedBoxes={suggestedBoxes}
                setBoxes={setBoxes}
                setMatchingDims={setMatchingDims}
                order={order}
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
