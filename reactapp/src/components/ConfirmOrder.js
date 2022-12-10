import React from "react";
// Import Components

const ConfirmOrder = ({ boxes, handleFormChange, handleButtonStatus }) => {
  if (boxes.length === 0) {
    return null;
  }
  const changeText = (e) => {
    const btn = e.target;
    if (btn.textContent === "Confirm") {
      btn.textContent = "Edit";
      handleFormChange("hideForm");
      handleButtonStatus(true);
    } else {
      btn.textContent = "Confirm";
      handleFormChange("displayForm");
      handleButtonStatus(false);
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
