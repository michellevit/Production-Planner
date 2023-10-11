import React, { useState } from "react";
import "./AddLineItem.css";
import HomeErrorModal from "./HomeErrorModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";

const AddLineItem = ({
  items,
  setItems,
  showHomeErrorModal,
  setShowHomeErrorModal,
  errorMessage,
  setErrorMessage,
}) => {
  const handleAddOrderLineItem = (e) => {
    e.preventDefault();
    const itemName = document.getElementById("add-line-item-name").value;
    const itemQty = document.getElementById("add-line-item-qty").value;
    if (itemName.trim() === "") {
      setErrorMessage("Please enter a valid item name.");
      setShowHomeErrorModal(true);
      return;
    }
    const parsedItemQty = parseFloat(itemQty);
    if (isNaN(parsedItemQty) || parsedItemQty <= 0) {
      setErrorMessage("Please enter a valid (positive) quantity.");
      setShowHomeErrorModal(true);
      return;
    }
    const roundedItemQty =
      parsedItemQty % 1 >= 0.5
        ? Math.ceil(parsedItemQty)
        : Math.floor(parsedItemQty);
    setItems((prevItems) => ({
      ...prevItems,
      [itemName]: roundedItemQty,
    }));
    document.getElementById("add-line-item-name").value = "";
    document.getElementById("add-line-item-qty").value = "";
  };
  const handleDeleteItem = (itemNameToDelete) => {
    const updatedItems = { ...items };
    delete updatedItems[itemNameToDelete];
    setItems(updatedItems);
  };
  return (
    <div className="add-line-item-container">
      <div>
        <HomeErrorModal
          showHomeErrorModal={showHomeErrorModal}
          setShowHomeErrorModal={setShowHomeErrorModal}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
        <input id="add-line-item-name" type="text" maxLength={24}></input>
        <input id="add-line-item-qty" type="number"></input>
        <button id="add-line-item-button" onClick={handleAddOrderLineItem}>
          <FontAwesomeIcon icon={faAdd} />
        </button>
      </div>
      <div id="line-item-list">
        <ul>
          {Object.keys(items).map((itemName) => (
            <li key={itemName}>
              <div className="line-item-info">
                {itemName} - {items[itemName]}
              </div>
              <button
                className="delete-line-item-button"
                onClick={() => handleDeleteItem(itemName)}
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
