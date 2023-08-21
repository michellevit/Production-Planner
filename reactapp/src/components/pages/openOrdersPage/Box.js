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
  hideButtons,
  handleFormChange,
  handleButtonStatus,
}) => {
  const [isConfirmIcon, setIsConfirmIcon] = useState(true);
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
    }
  const confirmEditHandler = () => {
    setIsConfirmIcon(prevState => !prevState);
    if (isConfirmIcon) {
      handleFormChange("hideForm");
      handleButtonStatus(true);
    } else {
      handleFormChange("displayForm");
      handleButtonStatus(false);
    }
  };

  return (
    <div className="box">
      <div className="box-info">
        <b>Box {counter}: </b>
        {box.dimensions} - {box.weight} lb
      </div>
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
          <button className="check-btn" onClick={confirmEditHandler}>
            <FontAwesomeIcon icon={isConfirmIcon ? faCheck : faEdit} />
          </button>
        </div>
      )}
    </div>
  );
};
export default Box;
