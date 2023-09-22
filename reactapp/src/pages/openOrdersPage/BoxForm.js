import "./BoxForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";

const BoxForm = ({
  formDisplay,
  setFormDisplay,
  setButtonDisplay,
  setBoxes,
  boxes,
  boxConfirmStatus,
  setBoxConfirmStatus,
  readyStatus,
  updatePackages,
}) => {
  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");

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
    setBoxConfirmStatus(false);
    setFormDisplay(true);
    setButtonDisplay(true);

    if (dimensions === "") {
      return false;
    }

    if (weight === "") {
      return true;
    }
    const formattedWeight = parseFloat(weight).toFixed(2);
    const finalWeight = parseFloat(formattedWeight); 
    setBoxes((prevBoxes) => [
      ...prevBoxes,
      {
        dimensions: dimensions,
        weight: finalWeight,
        id: uniqueId(),
      },
    ]);
    setDimensions("");
    setWeight("");
    updatePackages([...boxes, { dimensions, weight, id: uniqueId() }]);
  };
  useEffect(() => {
    if (boxConfirmStatus) {
      setDimensions("");
      setWeight("");
    }
  }, [boxConfirmStatus]);

  useEffect(() => {
    if (readyStatus) {
      setFormDisplay(false);
    } else if (boxes.length === 0) {
      setFormDisplay(true);
    }
  }, [readyStatus, boxes.length]);

  return (
    <div className="boxform-container">
      {formDisplay && (
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
            <option value="9.125 x 9.125 x 9.125">
              9.125" 9.125" x 9.125"
            </option>
          </select>
          <input
            type="number"
            className="weight"
            placeholder="lb"
            min="0"
            step="1"
            onChange={inputWeightHandler}
            value={weight}
          ></input>
          <button onClick={submitBoxHandler}>
            <FontAwesomeIcon icon={faAdd} />
          </button>
        </form>
      )}
    </div>
  );
};

export default BoxForm;