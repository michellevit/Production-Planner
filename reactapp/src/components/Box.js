import React from "react";

const Box = ({ boxes, box }) => {
  var counter = boxes.indexOf(box) + 1;
  return (
    <div className="box">
      <li className="box-item">
        <b>Box {counter}: </b>
        {box.dimensions} - {box.weight} lb
      </li>
      <button className="up-btn">
        <i className="fas fa-arrow-up"></i>
      </button>
      <button className="down-btn">
        <i className="fas fa-arrow-down"></i>
      </button>
      <button className="xmark-btn">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};
export default Box;
