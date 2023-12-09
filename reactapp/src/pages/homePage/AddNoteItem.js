import React, { useState } from "react";
import "./AddNoteItem.css";
import ErrorModal from "../../components/ErrorModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";

const AddNoteItem = ({
  notes,
  setNotes,
  showErrorModal,
  setShowErrorModal,
  errorMessage,
  setErrorMessage,
}) => {
  const [noteItemText, setNoteItemText] = useState("");
  const handleAddOrderNoteItem = (e) => {
    e.preventDefault();
    if (noteItemText.trim() === "") {
      setErrorMessage("Please enter text before submitting.");
      setShowErrorModal(true);
      return;
    }
    const newNote = {
      id: Date.now(),
      noteText: noteItemText,
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
    setNoteItemText("");
  };
  const handleDeleteItem = (noteIdToDelete) => {
    const updatedNotes = notes.filter((note) => note.id !== noteIdToDelete);
    setNotes(updatedNotes);
  };
  return (
    <div className="add-note-item-container">
      <div>
      <ErrorModal
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
        <input
          id="add-note-text"
          type="text"
          value={noteItemText}
          maxLength={120}
          onChange={(e) => setNoteItemText(e.target.value)}
          autoComplete="off"
        ></input>
        <button
          id="add-note-item-button"
          type="button"
          onClick={handleAddOrderNoteItem}
        >
          <FontAwesomeIcon icon={faAdd} />
        </button>
      </div>
      <div id="note-item-list">
        <ul>
          {notes.map((note, index) => (
            <li key={index}>
              {note.noteText}
              <button
                id="delete-note-item-button"
                type="button"
                onClick={() => handleDeleteItem(note.id)}
              >
                <FontAwesomeIcon icon={faClose} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddNoteItem;
