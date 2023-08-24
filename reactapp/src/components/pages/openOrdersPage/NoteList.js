import React from "react";
import "./NoteList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import NoteItem from "./NoteItem";

const NoteList = ({ readyStatus, notes, setNotes }) => {
  const [note, setNote] = useState("");
  const inputNoteHandler = (e) => {
    setNote(e.target.value);
  };
  const submitNoteHandler = (e) => {
    e.preventDefault();
    if (note === "") {
      return false;
    }
    setNotes([
      ...notes,
      {
        noteText: note,
      },
    ]);
    setNote("");
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
          ></input>
          <button onClick={submitNoteHandler}>
            <FontAwesomeIcon icon={faAdd} />
          </button>
        </form>
      )}
      {notes.length > 0 && (
        <div className="notelist-container">
            <ul className="notelist">
            {notes.map((note) => (
                <div className="noteitem-container">
                <NoteItem
                    note={note}
                    notes={notes}
                />
                </div>
            ))}
            </ul>
        </div>
      )}
    </div>
  );
};

export default NoteList;

