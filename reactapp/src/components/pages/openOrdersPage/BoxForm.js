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
}) => {
  if (formDisplay === "hideForm") {
    return null;
  }
  const inputDimensionsHandler = (e) => {
    setDimensions(e.target.value);
  };
  const inputWeightHandler = (e) => {
    setWeight(e.target.value);
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
      },
    ]);
    setDimensions("");
    setWeight("");
  };
  return (
    <div className="box-form">
      <form>
        <div className="formInput">
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
        </div>
        <div>
        <input
          type="number"
          className="weight"
          placeholder="lb"
          min="0"
          onChange={inputWeightHandler}
          value={weight}
        ></input>
        </div>
        <div>
          <button className="add-btn" onClick={submitBoxHandler}>
          <FontAwesomeIcon icon={faAdd} />
        </button>
        </div>
      </form>
      
    </div>
  );
};

export default BoxForm;
