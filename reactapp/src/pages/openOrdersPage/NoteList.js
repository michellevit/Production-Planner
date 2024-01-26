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

  const submitNoteHandler = async (e) => {
    e.preventDefault();
    if (note === "") {
      return;
    }
    const newNote = {
      id: Date.now(),
      noteText: note,
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);

    try {
      await updateNotes(updatedNotes);
    } catch (error) {
      console.error("Error adding note:", error);
      setNotes(notes);
    }

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
            maxLength={120}
          ></input>
          <button onClick={submitNoteHandler}>
            <FontAwesomeIcon icon={faAdd} />
          </button>
        </form>
      )}
      <div className="notelist-container">
      <ul className="notelist">
          {Array.isArray(notes) &&
            notes.map((note) => (
              <div key={note.id} className="noteitem-container">
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
