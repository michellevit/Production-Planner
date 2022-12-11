import React from "react";
import "./BoxForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

const BoxForm = ({
  formDisplay,
  setDimensions,
  dimensions,
  setWeight,
  weight,
  setBoxes,
  boxes,
  note,
  setNote,
  handleNoteStatus,
}) => {
  if (formDisplay == "hideForm") {
    return null;
  }
  const inputDimensionsHandler = (e) => {
    setDimensions(e.target.value);
  };
  const inputWeightHandler = (e) => {
    setWeight(e.target.value);
  };
  const inputNoteHandler = (e) => {
    setNote(e.target.value);
  };
  const uniqueId = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substring(2);
    return dateString + randomness;
  };
  const submitBoxHandler = (e) => {
    e.preventDefault();
    if (dimensions === "") {
      return false;
    }
    if (weight === "") {
      return true;
    }
    setBoxes([
      ...boxes,
      {
        dimensions: dimensions,
        weight: weight,
        id: uniqueId(),
        note: note,
      },
    ]);
    setDimensions("");
    setWeight("");
    setNote("");
    if (note !== "") {
      handleNoteStatus(false);
    }
  };
  return (
    <div className="box-form">
      <form>
        <select
          name="dimensions"
          className="dimensions"
          onChange={inputDimensionsHandler}
          value={dimensions}
          id="mySelect"
        >
          <option hidden>Dimensions</option>
          <option value="TBD">TBD</option>
          <option value="10 x 8 x 3">10" x 8" x 3"</option>
          <option value="9.125 x 9.125 x 9.125">9.125" 9.125" x 9.125"</option>
        </select>
        <input
          type="number"
          className="weight"
          placeholder="lb"
          min="0"
          onChange={inputWeightHandler}
          value={weight}
        ></input>
        <input
          type="text"
          className="note"
          placeholder="Note"
          onChange={inputNoteHandler}
          value={note}
        ></input>
        <button className="add-btn" onClick={submitBoxHandler}>
          <FontAwesomeIcon icon={faAdd} />
        </button>
      </form>
    </div>
  );
};

export default BoxForm;
