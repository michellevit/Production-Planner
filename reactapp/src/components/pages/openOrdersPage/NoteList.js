import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import NoteItem from "./NoteItem";
import "./NoteList.css";

const NoteList = ({ readyStatus, notes, setNotes, updateNotes }) => {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (readyStatus) {
      setNote("");
    }
  }, [readyStatus]);

  const inputNoteHandler = (e) => {
    setNote(e.target.value);
  };

  const submitNoteHandler = (e) => {
    e.preventDefault();
    if (note === "") {
      return false;
    }
    const updatedNotes = [
      ...(Array.isArray(notes) ? notes : []),
      {
        id: Date.now(),
        noteText: note,
      },
    ];
    setNotes(updatedNotes);
    updateNotes(updatedNotes);
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
            maxLength={38}
          ></input>
          <button onClick={submitNoteHandler}>
            <FontAwesomeIcon icon={faAdd} />
          </button>
        </form>
      )}
      <div className="notelist-container">
        <ul className="notelist">
          {Array.isArray(notes) &&
            notes.map((note, index) => (
              <div key={index} className="noteitem-container">
                <NoteItem
                  note={note}
                  notes={notes}
                  setNotes={setNotes}
                  readyStatus={readyStatus}
                  updateNotes={updateNotes}
                />
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default NoteList;
