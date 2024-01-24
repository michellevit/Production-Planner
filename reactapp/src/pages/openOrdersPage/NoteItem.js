import React from "react";
import "./NoteItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const NoteItem = ({ note, notes, setNotes, updateNotes, readyStatus }) => {
  const deleteHandler = async () => {
    const newNotes = notes.filter((el) => el.id !== note.id);
    setNotes(newNotes);
    try {
      await updateNotes(newNotes);
    } catch (error) {
      console.error("Error updating notes:", error);
      setNotes(notes);
  }
};
  return (
    <div className="noteitem">
      <div className={readyStatus ? "noteitem-info-ready" : "noteitem-info-notready"}>
        <b>Note {notes.indexOf(note) + 1}: </b>{note.noteText}
      </div>
      {!readyStatus && (
      <button className="xmark-btn" onClick={deleteHandler}>
        <FontAwesomeIcon icon={faClose} />
      </button>
      )}
    </div>
  );
};

export default NoteItem;
