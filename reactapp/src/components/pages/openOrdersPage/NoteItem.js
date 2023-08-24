import React from "react";
import "./NoteItem.css";


const NoteItem = ({ note, notes }) => {
  return (
    <div className="noteitem">
      <div className="noteitem-info">
        <b>Note {notes.indexOf(note) + 1}: </b>
        {note.noteText}
      </div>
    </div>
  );
};

export default NoteItem;
