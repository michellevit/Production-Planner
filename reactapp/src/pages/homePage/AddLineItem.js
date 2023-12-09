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
  setMatchingDims,
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
    setMatchingDims(false);
    const itemName = document.getElementById("add-line-item-name").value;
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
