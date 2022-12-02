import React from "react";
// Import Components
import Box from "./Box";

const BoxList = ({ boxes, setBoxes }) => {
  return (
    <div className="boxlist-container">
      <ul className="boxlist">
        {boxes.map((box) => (
          <Box box={box} boxes={boxes} setBoxes={setBoxes} />
        ))}
      </ul>
    </div>
  );
};
export default BoxList;
