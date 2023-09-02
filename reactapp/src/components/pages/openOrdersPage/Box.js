import React from "react";
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
  boxFormConfirmStatus,
  setBoxFormConfirmStatus,
  boxFormConfirmHandler,
  readyStatus,
  updatePackages,
}) => {
  const upHandler = () => {
    const index = boxes.indexOf(box);
    if (index !== 0) {
      let temp = boxes[index - 1];
      boxes[index - 1] = boxes[index];
      boxes[index] = temp;
      setBoxes(boxes.map((box) => box));
    }
    updatePackages(boxes);
  };
  const downHandler = () => {
    const index = boxes.indexOf(box);
    if (index !== boxes.length - 1) {
      let temp = boxes[index + 1];
      boxes[index + 1] = boxes[index];
      boxes[index] = temp;
      setBoxes(boxes.map((box) => box));
    }
    updatePackages(boxes);
  };
  const deleteHandler = (e) => {
    let newBoxes = boxes.filter((el) => el.id !== box.id);
    setBoxes(newBoxes);
    updatePackages(boxes);
  };
  const handleConfirmClick = () => {
    setBoxFormConfirmStatus(!boxFormConfirmStatus);
    boxFormConfirmHandler();
    updatePackages(boxes);
  };

  return (
    <div className="box">
      <div className={readyStatus ? "box-info-ready" : "box-info-notready"}>
        <b>Box {boxes.indexOf(box) + 1}: </b>
        {box.dimensions} - {box.weight} lb
      </div>
      {!readyStatus && (
      <div className="dims-button-container">
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
        <button className={boxFormConfirmStatus ? "edit-btn" : "check-btn"} onClick={handleConfirmClick}>
          <FontAwesomeIcon icon={boxFormConfirmStatus ? faEdit : faCheck} />
        </button>
      </div>
      )}
    </div>
  );
};
export default Box;
