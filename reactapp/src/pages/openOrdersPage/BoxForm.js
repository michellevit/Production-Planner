import "./BoxForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import axios from "axios";

const BoxForm = ({
  formDisplay,
  setFormDisplay,
  setBoxes,
  boxes,
  boxConfirmStatus,
  setBoxConfirmStatus,
  readyStatus,
  updatePackages,
}) => {
  const [selectDimensionsData, setSelectDimensionsData] = useState([]);
  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDimensions();
      setSelectDimensionsData(data);
    };

    fetchData();
    if (boxConfirmStatus) {
      setDimensions("");
      setWeight("");
    }
    if (readyStatus) {
      setFormDisplay(false);
    } else {
      setFormDisplay(true);
    }
  }, [boxConfirmStatus, readyStatus, boxes.length, setFormDisplay]);

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

    if (dimensions === "") {
      return false;
    }

    if (weight === "") {
      return true;
    }
    const formattedWeight = parseFloat(weight).toFixed(2);
    const finalWeight = parseFloat(formattedWeight);
    const newBox = {
      dimensions: dimensions,
      weight: finalWeight,
      id: uniqueId(),
    };
    setBoxes((prevBoxes) => [...prevBoxes, newBox]);
    updatePackages([...boxes, newBox]);
    setDimensions("");
    setWeight("");
  };

  const fetchDimensions = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/dimensions/");
      return response.data; 
    } catch (error) {
      console.error("Error fetching dimensions", error);
      return [];
    }
  };

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
            {selectDimensionsData.map((dimension) => (
              <option key={dimension.id} value={dimension.package_size}>
                {dimension.package_size}
              </option>
            ))}
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
