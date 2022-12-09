import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

const BoxForm = (props) => {
  if (props.formDisplay == "hideForm") {
    return null;
  }
  const inputDimensionsHandler = (e) => {
    props.setDimensions(e.target.value);
  };
  const inputWeightHandler = (e) => {
    props.setWeight(e.target.value);
  };
  const uniqueId = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substring(2);
    return dateString + randomness;
  };
  const submitBoxHandler = (e) => {
    e.preventDefault();
    if (props.dimensions === "") {
      return false;
    }
    if (props.weight === "") {
      return false;
    }
    props.setBoxes([
      ...props.boxes,
      {
        dimensions: props.dimensions,
        weight: props.weight,
        id: uniqueId(),
        hasNote: false,
      },
    ]);
    props.setDimensions("");
    props.setWeight("");
  };
  return (
    <div className="box-form">
      <form>
        <select
          name="dimensions"
          className="dimensions"
          onChange={inputDimensionsHandler}
          value={props.dimensions}
        >
          <option hidden>Dimensions</option>
          <option value="TBD">TBD</option>
          <option value="Hi">Hi</option>
          <option value="Hello">Hello</option>
        </select>
        <input
          type="number"
          className="weight"
          placeholder="lb"
          min="0"
          onChange={inputWeightHandler}
          value={props.weight}
        ></input>
        <button className="add-btn" onClick={submitBoxHandler}>
          <FontAwesomeIcon icon={faAdd} />
        </button>
      </form>
    </div>
  );
};

export default BoxForm;
