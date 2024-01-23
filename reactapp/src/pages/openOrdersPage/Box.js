import React from "react";
import "./Box.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faClose,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";

const Box = ({ box, boxes, setBoxes, readyStatus, updatePackages }) => {
  const upHandler = () => {
    const index = boxes.indexOf(box);
    if (index !== 0) {
      const newBoxes = [...boxes];
      [newBoxes[index - 1], newBoxes[index]] = [newBoxes[index], newBoxes[index - 1]];
      setBoxes(newBoxes);
      updatePackages(newBoxes);
    }
  };
  const downHandler = () => {
    const index = boxes.indexOf(box);
    if (index < boxes.length - 1) {
      const newBoxes = [...boxes];
      [newBoxes[index], newBoxes[index + 1]] = [newBoxes[index + 1], newBoxes[index]];
      setBoxes(newBoxes);
      updatePackages(newBoxes);
    }
  };
  
  const uniqueId = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substring(2);
    return dateString + randomness;
  };
  const duplicateHandler = () => {
    const duplicatedBox = {
      id: uniqueId(), 
      dimensions: box.dimensions,
      weight: box.weight,
    };
    setBoxes((prevBoxes) => [...prevBoxes, duplicatedBox]);
    updatePackages([...boxes, duplicatedBox]);
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
        {Number.isFinite(box.weight) && <span> - {box.weight} lb</span>}
        {((box.weight === "TBD") && (box.dimensions === "TBD")) && <span></span>}
        {((box.weight === "TBD") && (box.dimensions !== "TBD")) && <span>- TBD</span>}
        {(box.weight === "") && <span></span>}
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
            <button className="duplicate-btn" onClick={duplicateHandler}>
              <FontAwesomeIcon icon={faCopy} />
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
