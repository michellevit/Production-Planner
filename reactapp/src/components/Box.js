import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faClose,
  faAdd,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

const Box = ({ boxes, box, setBoxes }) => {
  const [noteIcon, setIcon] = useState(faAdd);
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
    if (box.hasNote == false) {
      box.hasNote = true;
      e.currentTarget.style.backgroundColor = "peachpuff";
      const noteBox = document.createElement("input");
      noteBox.setAttribute("type", "text");
      noteBox.setAttribute("id", box.id + 1);
      noteBox.classList.add("noteBox");
      e.currentTarget.parentNode.appendChild(noteBox);
      setIcon(faMinus);
      checkHasNote();
    } else {
      box.hasNote = false;
      e.currentTarget.style.backgroundColor = "orange";
      const noteBox = document.getElementById(box.id + 1);
      noteBox.remove();
      setIcon(faAdd);
      checkHasNote();
    }
  };
  const checkHasNote = () => {
    var checker = 0;
    const boxItems = document.querySelectorAll(".box");
    for (let x = 0; x < boxes.length; x++) {
      if (boxes[x].hasNote == true) {
        for (let i = 0; i < boxItems.length; i++) {
          boxItems[i].style.justifyContent = "flex-start";
        }
        checker = 1;
      }
      if (checker == 0) {
        for (let i = 0; i < boxItems.length; i++) {
          boxItems[i].style.justifyContent = "center";
        }
      }
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
        <FontAwesomeIcon icon={noteIcon} />
      </button>
    </div>
  );
};
export default Box;
