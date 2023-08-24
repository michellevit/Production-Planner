import React from "react";
import "./Note.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

const Note = ({ readyStatus }) => {
  const [note, setNote] = useState("");
  const inputNoteHandler = (e) => {
    setNote(e.target.value);
  };
  const submitNoteHandler = (e) => {
    e.preventDefault();
    if (note === "") {
      return false;
    }
  };
  return (
    <div className="noteform-container">
      {!readyStatus && (
        <form>
          <input
            className="note-text"
            value={note}
            onChange={inputNoteHandler}
            placeholder="Add note"
          >
          </input>
          <button onClick={submitNoteHandler}>
            <FontAwesomeIcon icon={faAdd} />
          </button>
        </form>
      )}
    </div>
  );
};

export default Note;
