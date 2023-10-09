import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import AddLineItem from "./AddLineItem";
import AddNoteItem from "./AddNoteItem";
import "./AddOrder.css";

const AddOrder = () => {
  const [shipDate, setShipDate] = useState("");
  const [items, setItems] = useState({});
  const [notes, setNotes] = useState([]);
  const [showHomeErrorModal, setShowHomeErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmitNewOrder = async (e) => {
    e.preventDefault();
    if (Object.keys(items).length === 0) {
      setErrorMessage("Please add at least one item.");
      setShowHomeErrorModal(true);
      return; 
    }
    const orderNumber = document.getElementById("add-order-so-number").value;
    const customerName = document.getElementById(
      "add-order-customer-name"
    ).value;
    const quoteValue = document.getElementById(
      "add-order-quote-boolean"
    ).checked;
    const formattedShipDate = shipDate
      ? shipDate.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    const orderData = {
      order_number: orderNumber,
      ship_date: formattedShipDate,
      customer_name: customerName,
      item_type_dict: items,
      item_subtype_dict: items,
      notes_array: notes,
      quote: quoteValue,
    };
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/all-orders/",
        orderData
      );
      if (quoteValue === true) {
        setErrorMessage("Your quote has been added.");
      } else {
        setErrorMessage("Your order has been added.");
      }
      setShowHomeErrorModal(true);
      document.getElementById("add-order-form").reset();
      setShipDate("");
      setItems({});
      setNotes([]);
    } catch (error) {
      setErrorMessage(
        "There was an error submitting your order.\nPlease ensure that all required fields have been completed."
      );
      setShowHomeErrorModal(true);
    }
  };
  return (
    <div className="add-order-container">
      <h2>Add Order</h2>
      <form id="add-order-form">
        <table className="add-order-table">
          <tbody>
            <tr>
              <td>SO#</td>
              <td>
                <input type="text" id="add-order-so-number" required></input>
              </td>
            </tr>
            <tr>
              <td>Customer</td>
              <td>
                <input
                  type="text"
                  id="add-order-customer-name"
                  required
                ></input>
              </td>
            </tr>
            <tr>
              <td>Ship Date</td>
              <td>
                <DatePicker
                  placeholderText=""
                  selected={shipDate}
                  onChange={(date) => {
                    setShipDate(date);
                  }}
                  isClearable
                  timeZone="Vancouver"
                />
              </td>
            </tr>
            <tr>
              <td>Items</td>
              <td>
                <AddLineItem
                  items={items}
                  setItems={setItems}
                  showHomeErrorModal={showHomeErrorModal}
                  setShowHomeErrorModal={setShowHomeErrorModal}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                />
              </td>
            </tr>
            <tr>
              <td>Notes</td>
              <td>
                <AddNoteItem
                  notes={notes}
                  setNotes={setNotes}
                  showHomeErrorModal={showHomeErrorModal}
                  setShowHomeErrorModal={setShowHomeErrorModal}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                />
              </td>
            </tr>
            <tr>
              <td>Quote</td>
              <td>
                <input type="checkbox" id="add-order-quote-boolean"></input>
              </td>
            </tr>
          </tbody>
        </table>
        <button id="submit-new-order-button" onClick={handleSubmitNewOrder}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddOrder;
