import React, { useState } from "react";
import "./AddLineItem.css";
import ErrorModal from "../../components/ErrorModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";

const AddLineItem = ({
  items,
  setItems,
  productNames,
  showErrorModal,
  setShowErrorModal,
  errorMessage,
  setErrorMessage,
  setDisplayQuoteModal,
}) => {
  const [filteredProductNames, setFilteredProductNames] = useState([]);
  const handleInputChange = (e) => {
    const input = e.target.value.toLowerCase();
    if (input) {
      const startsWithInput = productNames.filter((name) =>
        name.toLowerCase().startsWith(input)
      );
      const containsInput = productNames.filter(
        (name) =>
          name.toLowerCase().includes(input) &&
          !name.toLowerCase().startsWith(input)
      );
      setFilteredProductNames([...startsWithInput, ...containsInput]);
    } else {
      setFilteredProductNames([]);
    }
  };
  const handleAddOrderLineItem = (e) => {
    e.preventDefault();
    setDisplayQuoteModal(false);
    const fullValue = document.getElementById("add-line-item-name").value;
    const firstSpaceIndex = fullValue.indexOf(" ");
    let itemName, itemDescription;
    if (firstSpaceIndex === -1) {
      itemName = fullValue;
      itemDescription = fullValue;
    } else {
      itemName = fullValue.substring(0, firstSpaceIndex);
      itemDescription = fullValue.substring(firstSpaceIndex + 1);
    }
    const itemQty = document.getElementById("add-line-item-qty").value;
    if (itemName.trim() === "") {
      setErrorMessage("Please enter a valid item name.");
      setShowErrorModal(true);
      return;
    }
    const parsedItemQty = parseFloat(itemQty);
    if (isNaN(parsedItemQty) || parsedItemQty <= 0) {
      setErrorMessage("Please enter a valid (positive) quantity.");
      setShowErrorModal(true);
      return;
    }
    const newItem = {
      name: itemName,
      subname: itemName,
      description: itemDescription,
      requested_qty: parseFloat(itemQty),
      ship_qty: parseFloat(itemQty),
      backorder_qty: 0,
      previously_invoiced_qty: 0,
    };

    setItems((prevItems) => [...prevItems, newItem]);
    document.getElementById("add-line-item-name").value = "";
    document.getElementById("add-line-item-qty").value = "";
  };
  const handleDeleteItem = (itemNameToDelete, e) => {
    e.stopPropagation();
    setItems((prevItems) =>
      prevItems.filter((item) => item.name !== itemNameToDelete)
    );
    setDisplayQuoteModal(false);
  };
  return (
    <div className="add-line-item-container">
      <div>
        <ErrorModal
          showErrorModal={showErrorModal}
          setShowErrorModal={setShowErrorModal}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
        <input
          id="add-line-item-name"
          type="text"
          onChange={handleInputChange}
          autoComplete="off"
        />
        {filteredProductNames.length > 0 && (
          <div className="suggestions-dropdown">
            {filteredProductNames.map((name, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => {
                  document.getElementById("add-line-item-name").value = name;
                  setFilteredProductNames([]);
                }}
              >
                {name}
              </div>
            ))}
          </div>
        )}
        <input
          id="add-line-item-qty"
          type="number"
          min="1"
          autoComplete="off"
        ></input>
        <button id="add-line-item-button" onClick={handleAddOrderLineItem}>
          <FontAwesomeIcon icon={faAdd} />
        </button>
      </div>
      <div id="line-item-list">
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <div className="line-item-info">
                {item.name} {item.description} - Qty: {item.requested_qty}
              </div>
              <button
                type="button"
                className="delete-line-item-button"
                onClick={(e) => handleDeleteItem(item.name, e)}
              >
                <FontAwesomeIcon icon={faClose} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddLineItem;
