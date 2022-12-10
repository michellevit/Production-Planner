import React from "react";
// Import Components
import Box from "./Box";

const BoxList = ({ boxes, setBoxes, hideButtons }) => {
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
            />
          </div>
        ))}
      </ul>
    </div>
  );
};
export default BoxList;
