import React, { useState, useEffect } from "react";
import axios from "axios";

const NotesListSection = () => {
  let [notes, setNotes] = useState();

  useEffect(() => {
    getNotes();
  }, []);

  let getNotes = async () => {
    let response = await fetch("http://127.0.0.1:8000/api/notes/");
    let data = await response.json();
    console.log("DATA:", data);
    setNotes(data);
  };

  return (
    <div>
      <h2>Notes</h2>
      display notes here!
    </div>
  );
};

export default NotesListSection;
