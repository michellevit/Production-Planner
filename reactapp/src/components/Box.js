import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faClose,
} from "@fortawesome/free-solid-svg-icons";

const Box = ({
  boxes,
  box,
  setBoxes,
  hideButtons,
  hideNote,
  handleNoteStatus,
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
    let counter = 0;
    for (let x = 0; x < newBoxes.length; x++) {
      if (newBoxes[x].note !== "") {
        counter = 1;
      }
    }
    if (counter === 0) {
      handleNoteStatus(true);
    }
  };
  return (
    <div className="box">
      <div className="box-info">
        <b>Box {counter}: </b>
        {box.dimensions} - {box.weight} lb
      </div>
      {!hideNote && <div className="box-note">{box.note}</div>}
      {!hideButtons && (
        <div className="button-container">
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
    </div>
  );
};
export default Box;
