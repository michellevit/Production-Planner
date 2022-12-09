import React from "react";
import { useState } from "react";
// Import Components

const ConfirmOrder = ({ boxes, handleFormChange }) => {
  if (boxes.length == 0) {
    return null;
  }
  const changeText = (e) => {
    const btn = e.target;
    if (btn.textContent == "Confirm") {
      btn.textContent = "Edit";
      handleFormChange("hideForm");
    } else {
      btn.textContent = "Confirm";
      handleFormChange("displayForm");
    }
  };
  return (
    <div className="confirmButtonContainer">
      <button className="confirmButton" onClick={changeText}>
        Confirm
      </button>
    </div>
  );
};
export default ConfirmOrder;
