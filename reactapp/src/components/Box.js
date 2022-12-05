import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faClose,
  faAdd,
} from "@fortawesome/free-solid-svg-icons";

const Box = ({ boxes, box, setBoxes }) => {
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
  const deleteHandler = () => {
    setBoxes(boxes.filter((el) => el.id !== box.id));
  };
  const addNoteHandler = (e) => {
    if (box.note == false) {
      box.note = true;
      e.currentTarget.style.opacity = "0.5";
      const noteBox = document.createElement("input");
      noteBox.setAttribute("type", "text");
      noteBox.setAttribute("id", box.id + 1);
      noteBox.classList.add("noteBox");
      e.currentTarget.parentNode.appendChild(noteBox);
      console.log(this.props);
    } else {
      box.note = false;
      e.currentTarget.style.opacity = "1";
      const noteBox = document.getElementById(box.id + 1);
      noteBox.remove();
    }
  };
  return (
    <div className="box">
      <div className="box-info">
        <b>Box {counter}: </b>
        {box.dimensions} - {box.weight} lb
      </div>
      <button className="up-btn" onClick={upHandler}>
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
      <button className="down-btn" onClick={downHandler}>
        <FontAwesomeIcon icon={faArrowDown} />
      </button>
      <button className="xmark-btn" onClick={deleteHandler}>
        <FontAwesomeIcon icon={faClose} />
      </button>
      <button className="add-note-btn" onClick={addNoteHandler}>
        <FontAwesomeIcon icon={faAdd} />
      </button>
    </div>
  );
};
export default Box;
