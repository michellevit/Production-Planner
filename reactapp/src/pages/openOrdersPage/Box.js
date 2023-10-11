import React from "react";
import "./Box.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faClose,
} from "@fortawesome/free-solid-svg-icons";

const Box = ({
  box,
  boxes,
  setBoxes,
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
  const deleteHandler = () => {
    setBoxes((prevBoxes) => {
      const newBoxes = prevBoxes.filter((el) => el.id !== box.id);
      updatePackages(newBoxes);
      return newBoxes;
    });
  };
  return (
    <div className="box">
       <div className={readyStatus ? "box-info-ready" : "box-info-notready"}>
        <b>Box {boxes.indexOf(box) + 1}: </b>
        {box.dimensions}
        {box.weight !== null && <span> - {box.weight} lb</span>}
      </div>
      {!readyStatus && (
        <div className="dims-button-container">
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
        </div>
      )}
    </div>
  );
};
export default Box;
