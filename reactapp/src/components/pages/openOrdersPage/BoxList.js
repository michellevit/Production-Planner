import React, { useState } from "react";
import "./BoxList.css";
// Import Components
import Box from "./Box";

const BoxList = ({
  boxes,
  setBoxes,
  setFormDisplay,
  buttonDisplay,
  setButtonDisplay,
}) => {
  const [confirmStatus, setConfirmStatus] = useState(false);
  const handleConfirmButtonStatus = () => {
    if (confirmStatus) {
      boxes.map(box => ({ ...box, setConfirmStatus: true }));
    }
    else {
      boxes.map(box => ({ ...box, setConfirmStatus: false }));
    } 
    };
  return (
    <div className="boxlist-container">
      <ul className="boxlist">
        {boxes.map((box) => (
          <div key={box.id} className="box-container">
            <Box
              box={box}
              boxes={boxes}
              setBoxes={setBoxes}
              setFormDisplay={setFormDisplay}
              buttonDisplay={buttonDisplay}
              setButtonDisplay={setButtonDisplay}
              setConfirmStatus={setConfirmStatus}
              confirmStatus={confirmStatus}
              handleConfirmButtonStatus={handleConfirmButtonStatus}
            />
          </div>
        ))}
      </ul>
    </div>
  );
};
export default BoxList;




