import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import AddLineItem from "./AddLineItem";
import AddNoteItem from "./AddNoteItem";
import ErrorModal from "../../components/ErrorModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesUp, faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import "./AddOrder.css";

const AddOrder = () => {
  const [shipDate, setShipDate] = useState("");
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [tbd, setTBD] = useState(false);
  const [displayQuoteModal, setDisplayQuoteModal] = useState(false);
  const [suggestedDims, setSuggestedDims] = useState([]);
  const [showProductList, setShowProductList] = useState(false);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleGetQuote = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage("Please add at least one item.");
      setShowErrorModal(true);
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/fetch-matching-packages/`,
        {
          item_array: items,
        }
      );
      if (response.data.success) {
        setDisplayQuoteModal(true);
        const packagesArray = response.data.packages_array;
        const formattedPackagesArray = [];
        packagesArray.forEach(function (item, index) {
          formattedPackagesArray.push(
            `Box ${index + 1}: ${item.dimensions} - ${item.weight} lb`
          );
        });
        setSuggestedDims(formattedPackagesArray);
      } else {
        setDisplayQuoteModal(true);
        const noDimensionsMessage = [
          "There are no suggested dimensions available.",
          "Note: please make sure to use the full part number.",
        ];
        setSuggestedDims(noDimensionsMessage);
      }
    } catch (error) {
      console.error("Error fetching matching packages:", error);
      setErrorMessage(
        "An error occurred while trying to fetch a matching quote."
      );
      setShowErrorModal(true);
    }
  };

  const handleSubmitNewOrder = async (e) => {
    e.preventDefault();
    const orderNumber = document.getElementById("add-order-so-number").value;
    if (orderNumber === "") {
      setErrorMessage("Please enter an order number.");
      setShowErrorModal(true);
      return;
    }
    const customerName = document.getElementById(
      "add-order-customer-name"
    ).value;
    if (customerName === "") {
      setErrorMessage("Please enter a customer name.");
      setShowErrorModal(true);
      return;
    }
    if ((shipDate === "" || shipDate === null) && tbd === false) {
      setErrorMessage("Please enter a ship date or select the TBD checkbox.");
      setShowErrorModal(true);
      return;
    }
    if (items.length === 0) {
      setErrorMessage("Please add at least one item.");
      setShowErrorModal(true);
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
      item_array: items,
      notes_array: notes,
      quote: quoteValue,
    };
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/all-orders-create/`,
        orderData
      );
      if (quoteValue === true) {
        setErrorMessage("Your quote has been added.");
        setSuggestedDims([]);
      } else {
        setErrorMessage("Your order has been added.");
        setSuggestedDims([]);
      }
      setShowErrorModal(true);
      document.getElementById("add-order-form").reset();
      setShipDate("");
      setTBD(false);
      setItems([]);
      setNotes([]);
    } catch (error) {
      setErrorMessage(
        "There was an error submitting your order.\nPlease ensure that all required fields have been completed."
      );
      setShowErrorModal(true);
    }
    setDisplayQuoteModal(false);
  };
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/products/`
      );
      setProductList(response.data.map((product) => product.item_name));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const handleShowProductList = () => {
    setShowProductList(!showProductList);
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
                  autoComplete="off"
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
                  autoComplete="off"
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
                  productNames={productList}
                  showErrorModal={showErrorModal}
                  setShowErrorModal={setShowErrorModal}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                  setDisplayQuoteModal={setDisplayQuoteModal}
                />
              </td>
            </tr>
            <tr>
              <td>Notes</td>
              <td>
                <AddNoteItem
                  notes={notes}
                  setNotes={setNotes}
                  showErrorModal={showErrorModal}
                  setShowErrorModal={setShowErrorModal}
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
      {displayQuoteModal && (
        <div className="suggested-dims-div">
          <h3>Suggested Dimensions</h3>
          <div id="line-item-quoted">
            <ul>
              {items.map((item, index) => (
                <li key={index}>
                  <div className="line-item-info">
                    {item.name} {item.description} - Qty: {item.requested_qty}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <table>
            <tbody>
              {suggestedDims.map((item, index) => (
                <tr key={index}>
                  <td>{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div id="products-table">
        <h3>
          Products
          <button onClick={handleShowProductList}>
            {showProductList ? (
              <FontAwesomeIcon icon={faAnglesUp} />
            ) : (
              <FontAwesomeIcon icon={faAnglesDown} />
            )}
          </button>
        </h3>
        {showProductList && (
          <table>
            <tbody>
              {productList.map((productName, index) => (
                <tr key={index}>
                  <td>{productName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ErrorModal
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

export default AddOrder;
