import React from "react";
import { useState } from "react";
import "./Box.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faClose,
  faCheck,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

const Box = ({
  box,
  boxes,
  setBoxes,
  buttonDisplay,
  confirmStatus,
  setConfirmStatus,
  confirmHandler,
  readyStatus
}) => {
  var counter = boxes.indexOf(box) + 1;
  const upHandler = () => {
    const index = boxes.indexOf(box);
    if (index !== 0) {
      let temp = boxes[index - 1];
      boxes[index - 1] = boxes[index];
      boxes[index] = temp;
      setBoxes(boxes.map((box) => box));
    }
  };
  const downHandler = () => {
    const index = boxes.indexOf(box);
    if (index !== boxes.length - 1) {
      let temp = boxes[index + 1];
      boxes[index + 1] = boxes[index];
      boxes[index] = temp;
      setBoxes(boxes.map((box) => box));
    }
  };
  const deleteHandler = (e) => {
    let newBoxes = boxes.filter((el) => el.id !== box.id);
    setBoxes(newBoxes);
  };
  const handleConfirmClick = () => {
    setConfirmStatus(!confirmStatus);
    confirmHandler();
  };

  return (
    <div className="box">
      <div className="box-info">
        <b>Box {counter}: </b>
        {box.dimensions} - {box.weight} lb
      </div>
      {!readyStatus && (
      <div className="button-container">
        {buttonDisplay && (
          <div className="edit-buttons">
            <button className="up-btn" onClick={upHandler}>
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
            <button className="down-btn" onClick={downHandler}>
              <FontAwesomeIcon icon={faArrowDown} />
            </button>
            <button className="xmark-btn" onClick={deleteHandler}>
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
        )}
        <button className="check-btn" onClick={handleConfirmClick}>
          <FontAwesomeIcon icon={confirmStatus ? faEdit : faCheck} />
        </button>
      </div>
      )}
    </div>
  );
};
export default Box;
