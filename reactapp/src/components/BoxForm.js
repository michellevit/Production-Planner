import React from "react";

const BoxForm = (props) => {
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
    props.setBoxes([
      ...props.boxes,
      {
        dimensions: props.dimensions,
        weight: props.weight,
        deleted: false,
        boxNumber: 1,
        id: uniqueId(),
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
          <option value="Dimensions" hidden>
            Dimensions
          </option>
          <option value="TBD">TBD</option>
          <option value="Hi">Hi</option>
          <option value="Hello">Hello</option>
        </select>
        <input
          type="text"
          className="weight"
          placeholder="Weight"
          onChange={inputWeightHandler}
          value={props.weight}
        ></input>
        <button className="add-button" onClick={submitBoxHandler}>
          +
        </button>
      </form>
    </div>
  );
};

export default BoxForm;
