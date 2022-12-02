import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faClose,
} from "@fortawesome/free-solid-svg-icons";

const Box = ({ boxes, box, setBoxes }) => {
  var counter = boxes.indexOf(box) + 1;
  const upHandler = () => {
    const index = boxes.indexOf(box);
    if (index != 0) {
      let temp = boxes[index - 1];
      boxes[index - 1] = boxes[index];
      boxes[index] = temp;
      setBoxes(boxes.map((box) => box));
    }
  };
  const downHandler = () => {
    const index = boxes.indexOf(box);
    if (index != boxes.length - 1) {
      let temp = boxes[index + 1];
      boxes[index + 1] = boxes[index];
      boxes[index] = temp;
      setBoxes(boxes.map((box) => box));
    }
  };
  const deleteHandler = () => {
    setBoxes(boxes.filter((el) => el.id !== box.id));
  };
  return (
    <div className="box">
      <li className="box-item">
        <b>Box {counter}: </b>
        {box.dimensions} - {box.weight} lb
      </li>
      <button className="up-btn" onClick={upHandler}>
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
      <button className="down-btn" onClick={downHandler}>
        <FontAwesomeIcon icon={faArrowDown} />{" "}
      </button>
      <button className="xmark-btn" onClick={deleteHandler}>
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  );
};
export default Box;
