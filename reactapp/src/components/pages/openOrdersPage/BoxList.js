import React from "react";
import "./BoxList.css";
// Import Components
import Box from "./Box";

const BoxList = ({
  boxes,
  setBoxes,
  hideButtons,
  handleFormChange,
  handleButtonStatus
}) => {
  return (
    <div className="boxlist-container">
      <ul className="boxlist">
        {boxes.map((box) => (
          <div key={box.id} className="box-container">
            <Box
              box={box}
              boxes={boxes}
              setBoxes={setBoxes}
              hideButtons={hideButtons}
              handleFormChange={handleFormChange}
              handleButtonStatus={handleButtonStatus}
            />
          </div>
        ))}
      </ul>
    </div>
  );
};
export default BoxList;




