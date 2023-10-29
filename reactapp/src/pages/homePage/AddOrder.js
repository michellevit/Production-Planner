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
  const [tbd, setTBD] = useState(false);
  const [matchingDims, setMatchingDims] = useState(false);
  const [suggestedDims, setSuggestedDims] = useState([]);

  const handleGetQuote = async (e) => {
    e.preventDefault();
    if (Object.keys(items).length === 0) {
      setErrorMessage("Please add at least one item.");
      setShowHomeErrorModal(true);
      return;
    }
    console.log("Items sent to backend:", items);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/fetch-matching-packages/",
        {
          item_type_dict: items,
        }
      );
      console.log("RESPONSE:", response.data);
      if (response.data.success) {
        console.log("SUCCESS");
        setMatchingDims(true);
        const packagesArray = response.data.packages_array;
        setSuggestedDims(packagesArray);
        console.log(packagesArray);
      } else {
        setErrorMessage("No quote available.");
        setShowHomeErrorModal(true);
      }
    } catch (error) {
      console.error("Error fetching matching packages:", error);
      setErrorMessage(
        "An error occurred while trying to fetch a matching quote."
      );
      setShowHomeErrorModal(true);
    }
  };

  const handleSubmitNewOrder = async (e) => {
    e.preventDefault();
    const orderNumber = document.getElementById("add-order-so-number").value;
    if (orderNumber === "") {
      setErrorMessage("Please enter an order number.");
      setShowHomeErrorModal(true);
      return;
    }
    const customerName = document.getElementById(
      "add-order-customer-name"
    ).value;
    if (customerName === "") {
      setErrorMessage("Please enter a customer name.");
      setShowHomeErrorModal(true);
      return;
    }
    if ((shipDate === "" || shipDate === null) && tbd === false) {
      setErrorMessage("Please enter a ship date or select the TBD checkbox.");
      setShowHomeErrorModal(true);
      return;
    }
    if (Object.keys(items).length === 0) {
      setErrorMessage("Please add at least one item.");
      setShowHomeErrorModal(true);
      return;
    }
    const quoteValue = document.getElementById(
      "add-order-quote-boolean"
    ).checked;
    let formattedShipDate = shipDate
      ? shipDate.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    if (tbd) {
      formattedShipDate = null;
    }
    const orderData = {
      order_number: orderNumber,
      ship_date: formattedShipDate,
      delay_tbd: tbd,
      customer_name: customerName,
      item_type_dict: items,
      item_subtype_dict: items,
      notes_array: notes,
      quote: quoteValue,
    };
    try {
      await axios.post("http://127.0.0.1:8000/all-orders-create/", orderData);
      if (quoteValue === true) {
        setErrorMessage("Your quote has been added.");
      } else {
        setErrorMessage("Your order has been added.");
      }
      setShowHomeErrorModal(true);
      document.getElementById("add-order-form").reset();
      setShipDate("");
      setTBD(false);
      setItems({});
      setNotes([]);
    } catch (error) {
      console.log(orderData);
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
                <input
                  type="text"
                  id="add-order-so-number"
                  maxLength={100}
                ></input>
              </td>
            </tr>
            <tr>
              <td>Customer</td>
              <td>
                <input
                  type="text"
                  id="add-order-customer-name"
                  maxLength={100}
                ></input>
              </td>
            </tr>
            <tr>
              <td>Ship Date</td>
              <td id="delay-date-col">
                <DatePicker
                  placeholderText=""
                  selected={shipDate}
                  onChange={(date) => {
                    setShipDate(date);
                    setTBD(false);
                  }}
                  isClearable
                  timeZone="Vancouver"
                />
                TBD&nbsp;
                <input
                  type="checkbox"
                  id="tbd-checkbox"
                  checked={tbd}
                  onChange={(tbd) => {
                    setShipDate("");
                    setTBD(true);
                  }}
                ></input>
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
                  setMatchingDims={setMatchingDims}
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
        <div className="add-order-buttons-div">
          <button id="submit-new-order-button" onClick={handleSubmitNewOrder}>
            Submit
          </button>
          <button id="quote-new-order-button" onClick={handleGetQuote}>
            Quote
          </button>
        </div>
      </form>
      {matchingDims && (
        <div className="suggested-dims-div">
          <h2>Suggested Dimensions</h2>
          <table>
            <thead>
              <tr>
                <th className="suggested-dims">Dimensions</th>
                <th className="suggested-weight">Weight</th>
              </tr>
            </thead>
            <tbody>
              {suggestedDims.map((item, index) => (
                <tr key={index}>
                  <td className="suggested-dims">{item.dimensions}</td>
                  <td className="suggested-weight">{item.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddOrder;
